# Backend I – Entrega Final

Proyecto correspondiente a la Entrega Final del curso Backend I de Coderhouse.

El proyecto evolucionó desde una API con persistencia en archivos JSON y actualización en tiempo real con WebSockets, hacia una API profesionalizada con MongoDB y Mongoose, incorporando paginación, validaciones y separación de responsabilidades.

---

## 🚀 Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- mongoose-paginate-v2
- Express Handlebars
- Socket.io
- Bootstrap
- JavaScript (ES Modules)

---

## 🗄️ Evolución del Proyecto

### 🔹 Entregas Iniciales

- Persistencia mediante archivos `products.json` y `carts.json`.
- Uso de clases `ProductManager` y `CartManager`.
- Implementación de WebSockets para actualización en tiempo real de productos.
- Separación de rutas con Express Router.

### 🔹 Migración a MongoDB (Entrega Final)

- Eliminación de la lógica basada en archivos.
- Migración completa a MongoDB utilizando Mongoose.
- Importación inicial de productos desde `products.json` a la base de datos.
- Modelado de `Product` y `Cart`.
- Uso de `populate()` para relacionar productos dentro de carritos.

---

## 📦 Endpoints - Productos (/api/products)

Todos los endpoints fueron refactorizados para trabajar directamente con MongoDB.

### GET /

Soporta:

- `limit`
- `page`
- `sort` (asc / desc por precio)
- `query` (filtrado por categoría o disponibilidad)

Incluye:

- Paginación con `mongoose-paginate-v2`
- Links dinámicos (`prevLink`, `nextLink`) que respetan los query params originales
- Búsqueda case-insensitive para categoría usando `$regex` con opción `i`
- Uso de `lean()` para optimización de rendimiento

### GET /:pid

- Obtiene un producto por ID
- Maneja posibles errores

### POST /

- Crea un producto en MongoDB
- Validación de campos requeridos

### PUT /:pid

- Actualiza un producto existente
- Uso de `returnDocument: 'after'` (evitando warnings deprecados de Mongoose)

### DELETE /:pid

- Elimina un producto por ID

---

## 🛒 Endpoints - Carritos (/api/carts)

Se profesionalizó completamente la lógica de carritos.

### Funcionalidades implementadas

- Crear carrito
- Obtener carrito por ID (con `populate` de productos)
- Agregar producto al carrito
- Actualizar cantidad de producto en carrito
- Eliminar producto específico del carrito
- Vaciar carrito completo

### Validaciones agregadas

- Verificación de existencia del producto antes de agregarlo al carrito
- Respuestas HTTP consistentes

---

## 🖥️ Vistas (Handlebars)

Se implementaron vistas dinámicas integradas con la API:

- Listado de productos con paginación
- Filtros activos respetados entre páginas
- Barra superior sticky con botón "Ver Carrito" usando Bootstrap
- Vista de carrito con renderizado de productos relacionados

Por simplicidad se duplicó parte de la lógica de consulta con paginación entre rutas API y rutas de vistas.

---

## 🔌 WebSockets

Se mantiene la implementación con Socket.io:

- Servidor WebSocket anclado al servidor HTTP principal
- Emisión de eventos ante cambios en productos
- Sincronización en tiempo real en vistas dinámicas

Se implementó como mejora arquitectónica eliminar posibles dependencias circulares (por ejemplo, pasar `io` como parámetro en lugar de importarlo directamente).

---

## 🏗️ Mejoras de Arquitectura

- Eliminación de clases basadas en filesystem
- Separación clara entre:
  - Modelos
  - Rutas API
  - Rutas de vistas

- Uso consistente de async/await
- Manejo de errores estructurado

---

## ✅ Estado Final del Proyecto

✔ Migración completa a MongoDB
✔ Endpoints REST profesionalizados
✔ Paginación avanzada con filtros y ordenamiento
✔ Validaciones de integridad y existencia de recursos
✔ Relaciones entre colecciones usando populate
✔ Vistas dinámicas funcionales
✔ Actualización en tiempo real con WebSockets
✔ Proyecto listo para evaluación final

---

## 🔮 Posibles mejoras futuras

- Implementar autenticación y autorización
- Asociar carrito a usuario autenticado
- Middleware global de manejo de errores
- Tests automatizados
- Deploy en servicio cloud (Render, Railway, etc.)

---

## 👨‍💻 Autor

Proyecto desarrollado como parte del curso Backend I – Coderhouse.
