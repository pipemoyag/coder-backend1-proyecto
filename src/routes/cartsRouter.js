import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const productsInCart = await cartManager.getCartById(cid);
    res.status(200).json(productsInCart);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = Number(req.params.pid);

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

export default router;
