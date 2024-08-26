const socket = io();

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);

    if (isNaN(price) || price < 0) {
        alert("El precio debe ser un número positivo.");
        return;
    }

    socket.emit('newProduct', { title: name, price });
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
});

socket.on('productError', (errorMessage) => {
    alert("Error: " + errorMessage);
});

socket.on('productListUpdated', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        productList.innerHTML += `<li>${product.title} - ${product.price} <button onclick="deleteProduct('${product.id}')">Eliminar</button></li>`;
    });
});

function deleteProduct(productId) {
    console.log(`Deleting product with ID: ${productId}`);
    socket.emit('deleteProduct', productId);
}