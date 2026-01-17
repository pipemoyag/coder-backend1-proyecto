import { readFile, writeFile } from "./FilesManager.js";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    return await readFile(this.path);
  }

  async getProductById(id) {
    const productsList = await this.getProducts();
    const productById = productsList.find((prod) => prod.id === id);
    if (!productById) {
      throw new Error(`Producto con Id ${id} no encontrado`);
    } else {
      return productById;
    }
  }

  async addProduct(product) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = product; // desestructurar propiedades del objeto product

    if (
      !title ||
      !description ||
      !code ||
      price === undefined || // evita falsos positivos con price = 0
      status === undefined || // evita falsos positivos con status = false
      stock === undefined || // evita falsos positivos con stock = 0
      !category ||
      !thumbnails
    ) {
      throw new Error(
        "Producto debe contar con todos sus campos (title, description, code, price, status, stock, category, thumbnails,)",
      );
    }

    const productsList = await this.getProducts();

    const productInArray = productsList.find((prod) => prod.code === code);
    if (productInArray) {
      throw new Error(`Producto con code ${code} ya se encuentra en el Array`);
    }

    let newId = productsList[productsList.length - 1]?.id + 1 || 1;

    productsList.push({ ...product, id: newId });

    await writeFile(this.path, productsList);
  }

  async updateProduct(id, product) {
    // PENSANDO EN PUT, NO EN PATCH, SE PEDIRÁ QUE ESTÉN TODOS LOS CAMPOS
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = product;

    // validación de campos obligatorios
    if (
      !title ||
      !description ||
      !code ||
      price === undefined || // evita falsos positivos con price = 0
      status === undefined || // evita falsos positivos con status = false
      stock === undefined || // evita falsos positivos con stock = 0
      !category ||
      !thumbnails
    ) {
      throw new Error("Se deben enviar todos los campos del producto");
    }

    const productsList = await this.getProducts();

    const productIndex = productsList.findIndex((prod) => prod.id === id);

    if (productIndex === -1) {
      throw new Error(`Producto con Id ${id} no encontrado`);
    }

    // chequeo colisión de code (excepto el propio producto)
    const codeCollision = productsList.find(
      (prod) => prod.code === code && prod.id !== id,
    );

    if (codeCollision) {
      throw new Error(`Ya existe un producto con code ${code}`);
    }

    const updatedProduct = {
      id, // id fijo
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    productsList[productIndex] = updatedProduct;

    await writeFile(this.path, productsList);

    return updatedProduct;
  }

  async deleteProductById(id) {
    const productsList = await this.getProducts();
    const productById = productsList.find((prod) => prod.id === id);
    if (!productById) {
      throw new Error(`Producto con Id ${id} no encontrado`);
    } else {
      const productsListFiltered = productsList.filter(
        (prod) => prod.id !== id,
      );
      await writeFile(this.path, productsListFiltered);
    }
  }
}

export default ProductManager;
