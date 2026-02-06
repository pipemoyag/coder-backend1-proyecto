// ESTE ES EL "CLIENTE" DE SOCKETS
const socket = io(); // esta función "io" nos la da socket.io automáticamente cuando incluimos su script en el cliente

// contenedor donde se renderizan las cards
const productsContainer = document.getElementById("products-container");

socket.on("updatedProducts", (products) => {
  // limpiamos la vista
  productsContainer.innerHTML = "";

  products.forEach((prod) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img
          src="${prod.thumbnails?.[0] || ""}"
          class="card-img-top"
          alt="${prod.title}"
        />
        <div class="card-body">
          <h5 class="card-title">${prod.title}</h5>
          <p class="card-text">$ ${prod.price}</p>
        </div>
      </div>
    `;

    productsContainer.appendChild(col);
  });

  // alerta genérica cuando cambia la lista
  Swal.fire({
    icon: "warning",
    title: "Lista de productos actualizada",
    text: "Se han agregado o eliminado productos",
    confirmButtonText: "Aceptar", // botón obligatorio
  });
});
