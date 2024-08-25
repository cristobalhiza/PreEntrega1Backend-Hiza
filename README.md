
# E-commerce API

Este proyecto es una API desarrollada con Node.js y Express, diseñada para gestionar productos y carritos de compra en un sistema de e-commerce. La API permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre productos y carritos, con persistencia de datos utilizando el sistema de archivos (file system).

## Características

- **Gestión de Productos**: CRUD completo para productos, incluyendo verificación de unicidad para títulos.
- **Gestión de Carritos**: Creación de carritos, adición de productos a los carritos, y consulta de carritos por ID.
- **Persistencia**: Los datos se almacenan en archivos JSON (`products.json` y `carts.json`).

## Estructura del Proyecto

```
ecommerce-api/
├── src/
│   ├── data/
│   │   ├── products.json
│   │   └── carts.json
│   ├── dao/
│   │   ├── productsManager.js
│   │   └── cartsManager.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   └── server.js
├── .gitignore
├── package.json
├── README.md
```

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para aplicaciones web en Node.js.
- **fs/promises**: Módulo para el manejo de archivos con promesas.

## Instalación

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

### Pasos de Instalación

1. **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/ecommerce-api.git
    ```
2. **Instalar las dependencias**:
    ```bash
    cd ecommerce-api
    npm install
    ```

3. **Configurar los archivos de datos**:
   - Asegúrate de que existan los archivos `products.json` y `carts.json` en la carpeta `src/data/`.
   - Si no existen, puedes crearlos manualmente como archivos JSON vacíos (`[]`).

4. **Iniciar el servidor**:
    ```bash
    npm start
    ```

   El servidor se iniciará en el puerto `8080` por defecto.

## Uso

### Rutas Disponibles

#### **Productos**

- **GET /api/products**: Obtiene una lista de productos. Puede utilizar los parámetros `limit` y `skip` para paginación.
- **GET /api/products/:pid**: Obtiene un producto específico por ID.
- **POST /api/products**: Crea un nuevo producto. El título (`title`) debe ser único.
- **PUT /api/products/:pid**: Actualiza un producto existente por ID.
- **DELETE /api/products/:pid**: Elimina un producto por ID.

#### **Carritos**

- **POST /api/carts**: Crea un nuevo carrito.
- **GET /api/carts/:cid**: Obtiene un carrito específico por ID.
- **POST /api/carts/:cid/product/:pid**: Agrega un producto a un carrito específico.
- **DELETE /api/carts/:cid**: Elimina un carrito por ID.

### Ejemplos de Uso

#### Crear un Producto
```bash
POST /api/products
{
    "title": "Raqueta de Tenis Wilson Pro Staff",
    "description": "Raqueta de alto rendimiento, ideal para jugadores profesionales.",
    "code": "RACQUET123",
    "price": 250,
    "stock": 30,
    "category": "Tenis",
    "thumbnails": ["wilson_pro_staff1.jpg", "wilson_pro_staff2.jpg"]
}
```

#### Crear un Carrito
```bash
POST /api/carts
{
    "userId": 1
}
```

#### Agregar un Producto a un Carrito
```bash
POST /api/carts/1/product/1
```

### Errores Comunes

- **Producto No Encontrado**: Si intentas acceder o modificar un producto con un ID que no existe, recibirás un error 404.
- **Carrito No Encontrado**: Si intentas acceder o modificar un carrito con un ID que no existe, recibirás un error 404.
- **Título Duplicado**: Al intentar crear o actualizar un producto con un título que ya existe, recibirás un error 400.
