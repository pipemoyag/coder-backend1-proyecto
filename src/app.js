import express from "express";
import hbs from "express-handlebars";
import { Server } from "socket.io";
import websockets from "./websockets.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/view.routes.js";

const PORT = 8080;
const server = express();

// guardamos el server.listen (servidor) en una variable para anclarlo en socket.io más adelante
const httpServer = server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
export const io = new Server(httpServer);

// Configuración del motor de plantillas Handlebars
server.engine("handlebars", hbs.engine());
server.set("views", import.meta.dirname + "/views");
server.set("view engine", "handlebars"); // ya instalamos motor de plantillas, aquí decimos que lo utilice

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static(import.meta.dirname + "/public"));

server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);
server.use("/", viewsRouter);

websockets(io);
