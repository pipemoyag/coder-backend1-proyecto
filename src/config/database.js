import mongoose from "mongoose";

// en la practica, el mongodbUri debería tener la password en una variable de entorno
const mongodbUri =
  "mongodb+srv://fmoyagallo:6aUYEMfP83R62u19@cluster0.fa1luk6.mongodb.net/ecommerce?appName=Cluster0";

const dbConnect = async () => {
  try {
    // intento de conexión a la base de datos
    await mongoose.connect(mongodbUri);
    console.log("Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

export default dbConnect;
