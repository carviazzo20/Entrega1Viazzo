const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/carts.json');
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: Date.now().toString(),
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const product = cart.products.find(p => p.product === pid);
    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
