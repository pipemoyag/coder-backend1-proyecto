import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async createCart() {
    const newCart = {
      id: Date.now(),
      products: [],
    };
  }
}

export default CartManager;
