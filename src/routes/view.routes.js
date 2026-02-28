import { Router } from "express";

// se mantiene esto de la entrega 2, ya que su funcion era probar el funcionamiento de sockets
import ProductManager from "../managers/ProductManager.js";

// se agrega la nueva importacion pensando en la entrega final, para mostrar los productos con paginacion y llevarlos a la ventana del carrito
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";

const testCartId = "69a22a5ca6737a5fbc399414"; // id de carrito de prueba para agregar productos desde la vista

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();

  res.render("realTimeProducts", {
    title: "Lista dinámica de productos, no requiere recargar",
    products,
  });
});

router.get("/home", async (req, res) => {
  const products = await productManager.getProducts();

  res.render("home", {
    title: "Lista Estática de productos, requiere recargar",
    products,
  });
});

// rutas para la entrega final con paginacion y posibilidad de abrir detalle del producto
router.get("/products", async (req, res) => {
  try {
    let { limit = 10, page = 1 } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const result = await ProductModel.paginate(
      {},
      {
        limit,
        page,
        lean: true,
      },
    );

    res.render("products", {
      title: "Productos",
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      cartId: testCartId,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", {
      title: product.title,
      product,
      cartId: testCartId,
    });
  } catch (error) {
    res.status(500).send("Error al cargar producto");
  }
});

// Vista carro
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", {
      title: "Mi Carrito",
      cart,
    });
  } catch (error) {
    res.status(500).send("Error al cargar carrito");
  }
});

export default router;
