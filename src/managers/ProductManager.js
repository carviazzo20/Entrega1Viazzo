const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/products.json');
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newProduct = {
      id: Date.now().toString(),
      status: true,
      ...product
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updatedProduct = { ...products[index], ...updates, id };
    products[index] = updatedProduct;
    await this._writeFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(p => p.id !== id);
    await this._writeFile(newProducts);
  }
}

module.exports = ProductManager;
