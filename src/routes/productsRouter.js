import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router(); // router es un mini-express, sirve para agrupar rutas relacionadas
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json(products); // poner 200 en este caso es redundante, pero se deja para esta entrega
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  try {
    const product = await productManager.getProductById(pid);
    res.status(200).json(product);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

router.post("/", async (req, res) => {
  try {
    await productManager.addProduct(req.body);
    res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    if (
      error.message.includes("todos sus campos") ||
      error.message.includes("ya se encuentra")
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);
  const updatedProduct = req.body;

  try {
    const product = await productManager.updateProduct(pid, updatedProduct);
    res.status(200).json(product);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("todos los campos del producto")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("Ya existe un producto con code")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  try {
    await productManager.deleteProductById(pid);
    res.status(200).json({
      message: `Producto con id ${pid} eliminado correctamente`,
    });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

export default router;
