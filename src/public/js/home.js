const socket = io();

const list = document.getElementById('productList');

socket.on('updateProducts', (products) => {
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - $${p.price}`;
    list.appendChild(li);
  });
});
