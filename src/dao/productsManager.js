import fs from 'fs/promises';

export class ProductsManager {
    static path;

    static async getProducts(limit) {
        try {
            await fs.access(this.path);
            const data = await fs.readFile(this.path, 'utf-8');
            const products = data ? JSON.parse(data) : [];
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            throw new Error("No se pudieron obtener los productos: " + error.message);
        }
    }

    static async getProductById(id) {
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

    static async addProduct(product = {}) {
        try {
            const products = await this.getProducts();

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
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            throw new Error("No se pudo agregar el producto: " + error.message);
        }
    }

    static async updateProduct(id, productData) {
        try {
            const products = await this.getProducts();

            const existingProduct = products.find(p => p.title === productData.title && p.id !== id);
            if (existingProduct) {
                throw new Error(`Ya existe un producto con el título "${productData.title}".`);
            }

            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...productData, id };
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return products[index];
            } else {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
        } catch (error) {
            throw new Error("No se pudo actualizar el producto: " + error.message);
        }
    }

    static async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const newProducts = products.filter(p => p.id !== id);
            if (products.length !== newProducts.length) {
                await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
                return true;
            } else {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
        } catch (error) {
            throw new Error("No se pudo eliminar el producto: " + error.message);
        }
    }

    static generateId(products) {
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        return maxId + 1;
    }
}