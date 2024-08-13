import { Router } from 'express';
import { ProductsManager } from '../dao/productsManager.js';

const router = Router();
const productsManager = new ProductsManager('./src/data/products.json');

router.get('/', async (req, res) => {
    let products;
    try {
        products = await productsManager.getProducts();
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde",
            detalle: `${error.message}`,
        });
    }

    let { limit, skip } = req.query;

    if (limit) {
        limit = Number(limit);
        if (isNaN(limit) || limit < 0) {
            return res.status(400).json({ error: "Limit debe ser un número entero mayor o igual a 0" });
        }
    } else {
        limit = products.length;
    }

    if (skip) {
        skip = Number(skip);
        if (isNaN(skip) || skip < 0) {
            return res.status(400).json({ error: "Skip debe ser un número entero mayor o igual a 0" });
        }
    } else {
        skip = 0;
    }

    let resultado = products.slice(skip, skip + limit);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ resultado });
});

router.get('/:pid', async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) {
        return res.status(400).json({ error: "El ID del producto debe ser un número" });
    }

    let product;
    try {
        product = await productsManager.getProductById(pid);
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde",
            detalle: `${error.message}`,
        });
    }

    if (!product) {
        return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ product });
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, ...otros } = req.body;

    if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        return res.status(400).json({ error: "Faltan campos obligatorios o algunos campos no son válidos" });
    }

    try {
        const addedProduct = await productsManager.addProduct({ title, description, code, price, stock, category, ...otros });
        res.setHeader("Content-Type", "application/json");
        return res.status(201).json({ product: addedProduct });
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente nuevamente",
            detalle: `${error.message}`,
        });
    }
});

router.put('/:pid', async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) {
        return res.status(400).json({ error: "El ID del producto debe ser un número" });
    }

    let product;
    try {
        product = await productsManager.getProductById(pid);
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde",
            detalle: `${error.message}`,
        });
    }

    if (!product) {
        return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
    }

    const { ...aModificar } = req.body;
    delete aModificar.id;

    try {
        const updatedProduct = await productsManager.updateProduct(pid, aModificar);
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ product: updatedProduct });
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente nuevamente",
            detalle: `${error.message}`,
        });
    }
});

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) {
        return res.status(400).json({ error: "El ID del producto debe ser un número" });
    }

    try {
        const result = await productsManager.deleteProduct(pid);
        if (result) {
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ message: 'Producto eliminado' });
        } else {
            res.setHeader("Content-Type", "application/json");
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
        }
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente nuevamente",
            detalle: `${error.message}`,
        });
    }
});

export default router;