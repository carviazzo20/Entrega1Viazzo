const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const manager = new ProductManager();

// GET /
router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

// GET /:pid
router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

// POST /
router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newProduct = await manager.addProduct({
    title, description, code, price, stock, category, thumbnails
  });

  res.status(201).json(newProduct);
});

// PUT /:pid
router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
});

// DELETE /:pid
router.delete('/:pid', async (req, res) => {
  await manager.deleteProduct(req.params.pid);
  res.json({ message: 'Producto eliminado (si existía)' });
});

module.exports = router;
