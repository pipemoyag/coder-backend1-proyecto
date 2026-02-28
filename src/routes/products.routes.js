import { Router } from "express";
import ProductModel from "../models/product.model.js";

// usamos io como parametro para evitar referencia circular, ahora es una función que recibe io y devuelve el router, en lugar de usar el router directamente como antes
export default (io) => {
  const router = Router(); // router es un mini-express, sirve para agrupar rutas relacionadas

  router.get("/", async (req, res) => {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      limit = parseInt(limit);
      page = parseInt(page);

      // Construcción del filtro dinámico
      let filter = {};

      if (query) {
        // Con base al video enviado, el query será para disponibilidad y categoría
        if (query === "true" || query === "false") {
          filter.status = query === "true";
        } else {
          filter.category = { $regex: query, $options: "i" }; // por simplicidad se usa regex en lugar de haber usado toLowerCase al haber definido el schema
        }
      }

      // Construcción del ordenamiento
      let sortOption = {};
      if (sort === "asc") sortOption.price = 1;
      if (sort === "desc") sortOption.price = -1;

      const result = await ProductModel.paginate(filter, {
        limit,
        page,
        sort: sortOption,
        lean: true, // devuelve objetos JavaScript simples en lugar de documentos Mongoose, para mejorar el rendimiento
      });

      // Construcción dinámica de links solicitados en consigna, para la pagina respectiva, pero manteniendo el resto de query params
      const baseUrl = "/api/products";
      const queryParams = { ...req.query };

      const buildLink = (pageNumber) => {
        return `${baseUrl}?${new URLSearchParams({
          ...queryParams,
          page: pageNumber,
          limit,
        }).toString()}`;
      };

      res.status(200).json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: "Error al obtener los productos",
      });
    }
  });

  router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await ProductModel.findById(pid).lean();
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const newProduct = await ProductModel.create(req.body);

      const products = await ProductModel.find().lean();
      io.emit("updatedProducts", products);

      res.status(201).json({
        message: "Producto agregado correctamente",
        product: newProduct,
      });
    } catch (error) {
      if (error.code === 11000) {
        // Mongo maneja unique con error code 11000
        return res
          .status(409)
          .json({ error: "Ya existe un producto con ese CODE" });
      }

      res.status(400).json({ error: "Error al agregar el producto" });
    }
  });

  router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updatedProductBody = req.body;

    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        pid,
        updatedProductBody,
        { returnDocument: "after", runValidators: true }, // Para que devuelva el producto actualizado en lugar del original,y lo valide contra el schema
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.status(201).json({
        message: "Producto actualizado correctamente",
        product: updatedProduct,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(409)
          .json({ error: "Ya existe un producto con ese CODE" });
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(pid);

      if (!deletedProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      const products = await ProductModel.find().lean();
      io.emit("updatedProducts", products);

      res.status(200).json({
        message: `Producto eliminado correctamente`,
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  return router;
};
