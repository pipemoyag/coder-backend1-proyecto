import { readFile, writeFile } from "./FilesManager.js";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    return await readFile(this.path);
  }

  async createCart() {
    const cartsList = await this.getCarts();

    // id serán en formato ####, ej 0001, 0002, 0003, etc
    const lastId = cartsList[cartsList.length - 1]?.id;
    const nextIdNumber = lastId ? Number(lastId) + 1 : 1;
    let newId = String(nextIdNumber).padStart(4, "0");

    const newCart = {
      id: newId,
      products: [],
    };
    cartsList.push(newCart);
    await writeFile(this.path, cartsList);

    return newCart;
  }

  async getCartById(id) {
    const cartsList = await this.getCarts();
    const cartById = cartsList.find((cart) => cart.id === id);
    if (!cartById) {
      throw new Error(`Carrito con Id ${id} no encontrado`);
    } else {
      return cartById.products;
    }
  }

  async addProductToCart(cid, pid) {
    const cartsList = await this.getCarts();
    const cartIndex = cartsList.findIndex((cart) => cart.id === cid);
    if (cartIndex === -1) {
      throw new Error(`Carrito con Id ${cid} no encontrado`);
    }

    const productInCartIndex = cartsList[cartIndex].products.findIndex(
      (prod) => prod.product === pid,
    );
    if (productInCartIndex === -1) {
      // el producto no está en el carrito, se agrega con cantidad 1
      cartsList[cartIndex].products.push({ product: pid, quantity: 1 });
    } else {
      // el producto ya está en el carrito, se incrementa su cantidad
      cartsList[cartIndex].products[productInCartIndex].quantity += 1;
    }

    await writeFile(this.path, cartsList);
    return cartsList[cartIndex];
  }
}

export default CartManager;
