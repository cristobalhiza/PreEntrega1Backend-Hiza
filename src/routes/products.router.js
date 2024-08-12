import { Router } from 'express';
import { ProductsManager } from '../dao/productsManager.js';

const router = Router();
const productsManager = new ProductsManager('./src/data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await productsManager.getProducts(limit);
    res.json({ products });
});

// Obtener un producto por id
router.get('/:pid', async (req, res) => {
    const product = await productsManager.getProductById(req.params.pid);
    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    const newProduct = req.body;
    const addedProduct = await productsManager.addProduct(newProduct);
    res.status(201).json({ product: addedProduct });
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const updatedProduct = await productsManager.updateProduct(req.params.pid, req.body);
    if (updatedProduct) {
        res.json({ product: updatedProduct });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const result = await productsManager.deleteProduct(req.params.pid);
    if (result) {
        res.json({ message: 'Producto eliminado' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

export default router;
