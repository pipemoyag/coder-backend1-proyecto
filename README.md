# Backend I – Entrega N°2

Proyecto correspondiente a la Segunda Entrega del curso Backend I de Coderhouse.
Se extiende la API REST desarrollada en la entrega anterior incorporando Handlebars y WebSockets (Socket.io) para manejar vistas dinámicas y actualizaciones en tiempo real.

## Tecnologías

Node.js

Express

Express Handlebars

Socket.io

JavaScript (ES Modules)

Persistencia con sistema de archivos (fs / JSON)

## Estructura y funcionamiento

El servidor escucha en el puerto 8080 y expone los siguientes endpoints:

/api/products

/api/carts

/home

/realtimeproducts

Se continúa utilizando Express Router para organizar las rutas de la aplicación.

## Vistas

home.handlebars: muestra la lista completa de productos disponibles.

realTimeProducts.handlebars: muestra la lista de productos en tiempo real.

La vista realTimeProducts se actualiza automáticamente cada vez que se agrega o elimina un producto, sin necesidad de recargar la página, gracias al uso de WebSockets.

## WebSockets y actualización en tiempo real

Se configuró un servidor de Socket.io anclado al servidor HTTP principal.

Cada vez que ocurre una modificación en la lista de productos (agregar o eliminar producto), el servidor emite un evento con la lista actualizada, que es recibida por el cliente y renderizada dinámicamente.

## IMPORTANTE: Sobre la NO implementación de formularios

La consigna sugiere el uso de formularios en la vista realTimeProducts para crear y eliminar productos mediante WebSockets, pero aclara explícitamente que no es la mejor práctica.

En base a esto, se decidió no implementar formularios, y en su lugar:

- Mantener la creación y eliminación de productos a través de endpoints HTTP.

- Utilizar Socket.io únicamente para notificar y sincronizar en tiempo real los cambios hacia las vistas.

Esta decisión busca respetar la consigna sin forzar una solución que la misma documentación considera subóptima, manteniendo una separación clara entre lógica HTTP y comunicación en tiempo real.

## Decisiones de implementación

Persistencia mediante archivos products.json y carts.json.

Separación de responsabilidades usando ProductManager y CartManager.

El GET /api/carts/:cid devuelve exclusivamente la lista de productos del carrito, según la consigna.

El endpoint PUT /api/products/:pid fue implementado como un PUT estricto:

- Requiere todos los campos del producto.

- No permite modificar el id.

- Valida colisiones del campo code.

Los IDs de los carritos se generan como strings con padding (0001, 0002, etc.).

Actualización en tiempo real de productos usando WebSockets y renderizado dinámico en HTML.
