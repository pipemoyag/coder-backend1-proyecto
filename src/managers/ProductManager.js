import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8"); // Si existe, devuelve un string. Si no, salta al catch

      // Caso: archivo existe pero está vacío (trim elimina espacios al inicio y al final)
      if (data.trim() === "") {
        return []; // tira lista vacía (ok)
      }

      return JSON.parse(data);
    } catch (error) {
      // Caso: archivo no existe
      if (error.code === "ENOENT") {
        return []; // tira lista vacía (ok)
      }

      // Cualquier otro error sí es relevante
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const productsList = await this.getProducts();
      const productById = productsList.find((prod) => prod.id === id);
      if (!productById) {
        throw new Error(`Producto con Id ${id} no encontrado`);
      } else {
        return productById;
      }
    } catch (error) {
      throw error;
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
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      throw new Error(
        "Producto debe contar con todos sus campos (title, description, code, price, status, stock, category, thumbnails,)",
      );
    }

    try {
      const productsList = await this.getProducts();

      const productInArray = productsList.find((prod) => prod.code === code);
      if (productInArray) {
        throw new Error(
          `Producto con code ${code} ya se encuentra en el Array`,
        );
      }

      let newId = productsList[productsList.length - 1]?.id + 1 || 1;

      productsList.push({ ...product, id: newId });

      const data = JSON.stringify(productsList, null, 2); // null: No filtrar por propiedades ni nada; 2: Define la indentacion del JSON resultante

      await fs.writeFile(this.path, data);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, product) {
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
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      throw new Error("Se deben enviar todos los campos del producto");
    }

    try {
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

      const data = JSON.stringify(productsList, null, 2);
      await fs.writeFile(this.path, data);

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const productsList = await this.getProducts();
      const productsListFiltered = productsList.filter(
        (prod) => prod.id !== id,
      );

      const data = JSON.stringify(productsListFiltered, null, 2); // null: No filtrar por propiedades ni nada; 2: Define la indentacion del JSON resultante

      await fs.writeFile(this.path, data);
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;
