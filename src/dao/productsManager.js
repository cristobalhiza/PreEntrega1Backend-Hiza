import fs from 'fs/promises';

class ProductsManager {
    static path = './src/data/products.json';

    constructor() {}

    async getProducts(limit) {
        try {
            await fs.access(ProductsManager.path);
            const data = await fs.readFile(ProductsManager.path, 'utf-8');
            const products = data ? JSON.parse(data) : [];
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            throw new Error("No se pudieron obtener los productos: " + error.message);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto por ID: " + error.message);
        }
    }

    async addProduct(product = {}) {
        try {
            const products = await this.getProducts();
    
            // Convertir el precio a número
            product.price = Number(product.price);
    
            // Depuración de los datos recibidos después de la conversión
            console.log("Datos del producto después de la conversión:", product);
    
            // Validación para asegurarse de que el precio no sea negativo y sea un número
            if (isNaN(product.price) || product.price < 0) {
                throw new Error("El precio del producto debe ser un número positivo.");
            }
    
            const existingProduct = products.find(p => p.title === product.title);
            if (existingProduct) {
                throw new Error(`Ya existe un producto con el título "${product.title}".`);
            }
    
            const newProduct = {
                id: this.generateId(products),
                ...product,
                status: true
            };
            products.push(newProduct);
            await fs.writeFile(ProductsManager.path, JSON.stringify(products, null, 2));
    
            console.log("Producto agregado exitosamente:", newProduct);
    
            return products; 
        } catch (error) {
            console.error("Error al agregar el producto:", error.message);
            throw new Error("No se pudo agregar el producto: " + error.message);
        }
    }
    

    async updateProduct(id, productData) {
        try {
            const products = await this.getProducts();

            const existingProduct = products.find(p => p.title === productData.title && p.id !== id);
            if (existingProduct) {
                throw new Error(`Ya existe un producto con el título "${productData.title}".`);
            }

            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...productData, id };
                await fs.writeFile(ProductsManager.path, JSON.stringify(products, null, 2));

                return products; // Devolver la lista completa actualizada
            } else {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
        } catch (error) {
            throw new Error("No se pudo actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(id) {
        
        try {
            const products = await this.getProducts();
            console.log("Current products:", products); // Verifica la lista de productos actual
    
            // Asegúrate de que el ID sea un número antes de compararlo
            const numericId = Number(id);
            console.log(`Attempting to delete product with numeric ID: ${numericId}`);
            const newProducts = products.filter(p => p.id !== numericId);
            if (products.length !== newProducts.length) {
                await fs.writeFile(ProductsManager.path, JSON.stringify(newProducts, null, 2));
    
                return newProducts; // Devolver la lista completa actualizada
            } else {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
        } catch (error) {
            throw new Error("No se pudo eliminar el producto: " + error.message);
        }
    }

    generateId(products) {
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        return maxId + 1;
    }
}

const productsManager = new ProductsManager();

export { productsManager };
