const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /:cid
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// POST /:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  const product = await productManager.getProductById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  const updatedCart = await cartManager.addProductToCart(cid, pid);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

  res.json(updatedCart);
});

module.exports = router;
