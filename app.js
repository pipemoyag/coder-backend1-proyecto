import express from "express";
import productsRouter from "./src/routes/productsRouter.js";

const server = express();

server.use(express.json());
server.use("/api/products", productsRouter);

const puerto = 8080;
server.listen(puerto, () =>
  console.log(`El servidor está activo en el puerto ${puerto}`),
);
