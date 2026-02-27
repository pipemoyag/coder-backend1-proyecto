import express from "express";
import hbs from "express-handlebars";
import { Server } from "socket.io";

import websockets from "./websockets.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/view.routes.js";
import dbConnect from "./config/database.js";

import ProductModel from "./models/product.model.js";

const PORT = 8080;
const server = express();

let io; // declaramos la variable porque después la vamos a exportar

// Configuración del motor de plantillas Handlebars
server.engine("handlebars", hbs.engine());
server.set("views", import.meta.dirname + "/views");
server.set("view engine", "handlebars"); // ya instalamos motor de plantillas, aquí decimos que lo utilice

// Middlewares
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(import.meta.dirname + "/public"));

// Routers
// server.use("/api/products", productsRouter); // ya no se usa esta linea porque se corrigió referencia circular en products.routes.js
server.use("/api/carts", cartsRouter);
server.use("/", viewsRouter);

// Iniciar servidor
const startServer = async () => {
  try {
    await dbConnect(); // Conectar a la base de datos antes de iniciar el servidor

    // creamos un producto de prueba para verificar que la conexión a la base de datos funciona correctamente
    // const testProduct = await ProductModel.create({
    //   title: "Producto prueba",
    //   description: "Producto para crear la base",
    //   code: "TEST001",
    //   price: 1000,
    //   stock: 10,
    //   category: "Test",
    //   thumbnails: [],
    // });
    // console.log("Producto creado:", testProduct._id);

    // guardamos el server.listen (servidor) en una variable para anclarlo en socket.io más adelante
    const httpServer = server.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
    io = new Server(httpServer);
    websockets(io);
    server.use("/api/products", productsRouter(io)); // pasamos io a productsRouter para evitar referencia circular, ahora es una función que recibe io y devuelve el router
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
  }
};
startServer();

export { io };
