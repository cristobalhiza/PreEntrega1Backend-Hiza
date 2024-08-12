import { Router } from 'express';
import { CartsManager } from '../dao/cartsManager.js';

const router = Router();
const cartsManager = new CartsManager('./src/data/carts.json');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await cartsManager.createCart();
    res.status(201).json({ cart: newCart });
});

// Obtener productos de un carrito por id
router.get('/:cid', async (req, res) => {
    const cart = await cartsManager.getCartById(req.params.cid);
    if (cart) {
        res.json({ cart });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid);
    if (cart) {
        res.json({ cart });
    } else {
        res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
});

export default router;