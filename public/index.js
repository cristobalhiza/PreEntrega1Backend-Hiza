const socket = io();

socket.on('products', (products) => {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $${product.price}`;
        li.dataset.id = product.id;
        productsList.appendChild(li);
    });
});

const productForm = document.getElementById('product-form');
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = parseFloat(document.getElementById('price').value);

    if (!title || isNaN(price) || price <= 0) {
        alert("Por favor, ingresa un título válido y un precio mayor a 0.");
        return;
    }
    socket.emit('newProduct', { title, price });
    productForm.reset();
});

const deleteForm = document.getElementById('delete-form');
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = parseInt(document.getElementById('product-id').value);

    if (isNaN(productId) || productId <= 0) {
        alert("Por favor, ingresa un ID de producto válido.");
        return;
    }

    socket.emit('deleteProduct', productId);
    deleteForm.reset();
});
