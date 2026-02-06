import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const server = express();

server.use(express.json());
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

const puerto = 8080;
server.listen(puerto, () =>
  console.log(`El servidor está activo en el puerto ${puerto}`),
);
