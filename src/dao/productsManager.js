import fs from 'fs/promises';

export class ProductsManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts(limit) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            console.error("Error reading products:", error);
            throw new Error("Could not retrieve products");
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: this.generateId(products),
            ...product,
            status: true
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, productData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData, id };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(p => p.id !== id);
        if (products.length !== newProducts.length) {
            await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
            return true;
        }
        return false;
    }

    generateId(products) {
        const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
        return maxId + 1;
    }
}