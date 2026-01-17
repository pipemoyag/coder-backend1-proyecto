# Backend I – Entrega N°1

Proyecto correspondiente a la Primera Entrega del curso Backend I de Coderhouse.
Consiste en una API REST desarrollada con Node.js y Express, con persistencia en archivos JSON, para la gestión de productos y carritos de compra.

## Tecnologías

Node.js

Express

JavaScript (ES Modules)

Persistencia con sistema de archivos (fs)

## Estructura y funcionamiento

El servidor escucha en el puerto 8080 y expone los siguientes grupos de rutas:

/api/products

/api/carts

Se utilizó Express Router para organizar las rutas, tal como lo indica la consigna, aun cuando este contenido se encuentra en desarrollo en clases posteriores.

## Decisiones de implementación

La persistencia se realiza mediante los archivos products.json y carts.json.

Se separó la lógica de negocio en managers (ProductManager y CartManager).

El GET /api/carts/:cid devuelve solo la lista de productos del carrito, siguiendo estrictamente lo solicitado en la consigna.

El endpoint PUT /api/products/:pid fue implementado como un PUT estricto:

- Requiere todos los campos del producto.

- No permite modificar el id.

- Valida que no exista colisión de "code" con otros productos.

- Los IDs de los carritos se generan en formato string con padding (ej: 0001, 0002, etc.).
