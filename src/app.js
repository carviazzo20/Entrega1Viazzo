const express = require('express');
const { engine } = require('express-handlebars');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.get('/', (req, res) => {
  res.redirect('/home');
});


app.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// Socket.io
io.on('connection', async (socket) => {
  console.log('Cliente conectado');
  const products = await productManager.getProducts();
  socket.emit('updateProducts', products);

  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);
  });
});


server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

