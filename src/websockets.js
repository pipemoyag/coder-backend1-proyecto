export default (io) => {
  // ESTE ES EL "SERVIDOR" DE SOCKETS
  io.on("connection", (socket) => {
    // cada usuario tiene un ID único de conexión, lo podemos ver en la consola del navegador
    console.log("Usuario conectado con ID: " + socket.id);
  });
};
