import express from 'express';
import { productsManager } from '../dao/productsManager.js';  // Importar la exportación nombrada

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('realTimeProducts', { products });
});

export default router;
