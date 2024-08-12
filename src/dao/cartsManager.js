import fs from 'fs/promises';

export class CartsManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getCarts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: this.generateId(carts),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if (cartIndex !== -1) {
            const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);
            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += 1;
            } else {
                carts[cartIndex].products.push({ product: productId, quantity: 1 });
            }
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];
        }
        return null;
    }

    generateId(carts) {
        const maxId = carts.reduce((max, c) => c.id > max ? c.id : max, 0);
        return maxId + 1;
    }
}
