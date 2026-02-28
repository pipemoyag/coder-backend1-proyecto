document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.dataset.productId;

    const cartId = "69a22a5ca6737a5fbc399414"; // id de prueba

    try {
      const response = await fetch(
        `/api/carts/${cartId}/products/${productId}`,
        { method: "POST" },
      );

      if (response.ok) {
        Swal.fire("Agregado", "Producto agregado al carrito", "success");
      } else {
        Swal.fire("Error", "No se pudo agregar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    }
  }
});
