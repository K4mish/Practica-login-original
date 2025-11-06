const API_URL = 'http://localhost:3000/api/products';
const grid = document.getElementById('catalogo');
const cartCountEl = document.getElementById('cartCount');

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCountEl.textContent = cart.reduce((s, i) => s + Number(i.cantidad), 0);
}

async function loadProducts() {
    const resp = await fetch(API_URL);
    const data = await resp.json();
    grid.innerHTML = '';
    data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.imagen_url || '/img/no-image.png'}" alt="${p.producto}" />
            <h3>${p.producto}</h3>
            <p>${p.descripcion || ''}</p>
            <p><strong>Precio:</strong> $${Number(p.precio_venta).toFixed(2)}</p>
            <div class="actions">
            <input type="number" min="1" value="1" id="qty-${p.id}" style="width:64px" />
            <button data-id="${p.id}">Añadir al carrito</button>
            </div>`;
        grid.appendChild(card);
        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
        const qty = Number(document.getElementById(`qty-${p.id}`).value) || 1;
        addToCart({
            id: p.id,
            producto: p.producto,
            precio_venta: Number(p.precio_venta),
            cantidad: qty,
            imagen_url: p.imagen_url || ''
            });
        });
    });
}

function addToCart(item) {
    const cart = getCart();
    const exists = cart.find(i => Number(i.id) === Number(item.id));
    if (exists) {
        exists.cantidad = Number(exists.cantidad) + Number(item.cantidad);
    } else {
        cart.push(item);
    }
    saveCart(cart);
    alert('Añadido al carrito');
}

function init() {
    const cart = getCart();
    cartCountEl.textContent = cart.reduce((s, i) => s + Number(i.cantidad), 0);
    loadProducts();
}

init();