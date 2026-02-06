import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

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

export default router;
