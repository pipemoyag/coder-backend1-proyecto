import { Router } from "express";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });

    res.status(201).json({
      status: "success",
      payload: newCart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // VALIDACIÓN QUE HABIA QUEDADO PENDIENTE EN ENTREGA 2, VERIFICAR QUE EL PRODUCTO EXISTE EN EL CATALOGO DE PRODUCTOS (PID)
    const productExists = await ProductModel.findById(pid);
    if (!productExists) {
      return res
        .status(404)
        .json({ error: "Producto no existe en la base de datos" });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid,
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Nuevos endpoints requeridos en entrega final
router.put("/:cid", async (req, res) => {
  // por simplicidad no se validan los casos de quantity 0 o negativa, ni si el producto existe en el catalogo, se asume que body viene bien
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { products },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    // aquí sí validamos que quantity sea un número mayor a 0
    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity debe ser un número mayor a 0" });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Validar que el producto exista en DB
    const productExists = await ProductModel.findById(pid);
    if (!productExists) {
      return res
        .status(404)
        .json({ error: "Producto no existe en la base de datos" });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid,
    );

    if (!productInCart) {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    productInCart.quantity = quantity;

    await cart.save();

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Validar que el producto exista en DB
    const productExists = await ProductModel.findById(pid);
    if (!productExists) {
      return res
        .status(404)
        .json({ error: "Producto no existe en la base de datos" });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === pid,
    );

    if (!productInCart) {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartModel.findByIdAndUpdate(
      cid,
      { products: [] },
      { returnDocument: "after" },
    );

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({
      status: "success",
      message: "Carrito vaciado correctamente",
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
