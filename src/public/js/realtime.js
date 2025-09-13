window.deleteProduct = (id) => {
  socket.emit('deleteProduct', id);
};

const socket = io();
const form = document.getElementById('productForm');
const tableBody = document.querySelector('#productTable tbody');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());

  product.price = parseFloat(product.price);
  product.stock = parseInt(product.stock);

  socket.emit('newProduct', product);
  form.reset();
});

socket.on('updateProducts', (products) => {
  tableBody.innerHTML = '';

  products.forEach(p => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${p.title}</td>
      <td>$${p.price}</td>
      <td>${p.description}</td>
      <td><button onclick="deleteProduct('${p.id}')">Eliminar</button></td>
    `;

    tableBody.appendChild(tr);
  });
});