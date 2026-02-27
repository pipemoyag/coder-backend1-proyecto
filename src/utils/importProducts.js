import fs from "fs";
import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";

const mongodbUri =
  "mongodb+srv://fmoyagallo:6aUYEMfP83R62u19@cluster0.fa1luk6.mongodb.net/ecommerce?appName=Cluster0";

const importData = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("Conectado a MongoDB");

    // eliminamos los productos existentes para evitar duplicados al importar
    await ProductModel.deleteMany({});

    const data = fs.readFileSync("./src/data/products.json", "utf-8");
    const products = JSON.parse(data);

    // Eliminamos el campo id porque Mongo usa _id
    const cleanedProducts = products.map(({ id, ...rest }) => rest);

    await ProductModel.insertMany(cleanedProducts);

    console.log("Productos importados correctamente");
    process.exit();
  } catch (error) {
    console.error("Error importando productos:", error);
    process.exit(1);
  }
};

importData();
