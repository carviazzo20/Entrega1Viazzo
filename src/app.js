const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Productos y Carritos');
});

