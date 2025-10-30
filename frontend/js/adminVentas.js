const token = localStorage.getItem('token');
if (!token) { alert('Inicia sesión.'); window.location.href = 'login.html'; };

const API_URL = 'http://localhost:3000/api';
const clientSelect = document.getElementById("clientSelect");
const productoSelect = document.getElementById("productoSelect");
const cantidadInput = document.getElementById("cantidad");
const btnAdd = document.getElementById("btnAdd");
const itemsBody = document.getElementById("itemsBody");
const AdminTotalEl = document.getElementById("AdminTotal");
const btnSubmit = document.getElementById("btnSubmit");
const historialDiv = document.getElementById("historial");
const adminMetodo = document.getElementById("admin_metodo_pago");

let items = [];
let productsCache = [];

// Cargar usuarios, clientes y productos
async function loadUsers() {
    const res = await fetch(`http://localhost:3000/api/users`, {headers: { 'Authorization': `Bearer ${token}` }});
    const data = await res.json();
    clientSelect.innerHTML = data.map(u => `<option value="${u.id}">${u.name}, (${u.email})</option>`).join('');
}
// Cargar productos
async function loadProducts() {
    const res = await fetch(`http://localhost:3000/api/products`);
    const data = await res.json();
    productsCache = data;
    productoSelect.innerHTML = data.map(p => `<option value="${p.id}" data-price="${p.precio_venta}">${p.producto} - $${Number(p.precio_venta).toFixed(2)} (Stock: ${p.stock})</option>`).join('');
}

function renderItems() {
    itemsBody.innerHTML = "";
    let total = 0;
    items.forEach((it, idx) => {
        const subtotal = it.precio_unitario * it.cantidad;
        total += subtotal;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${it.producto}</td>
            <td>${it.cantidad}</td>
            <td>$ ${Number(it.precio_unitario).toFixed(2)}</td>
            <td>$ ${Number(subtotal).toFixed(2)}</td>
            <td><button data-idx="${idx}" class="remove">Eliminar</button></td>
        `;
        itemsBody.appendChild(tr);
    });
    AdminTotalEl.textContent = `Total: $ ${Number(total).toFixed(2)}`;
    
    document.querySelectorAll(".remove").forEach(b => {
        b.addEventListener("click", (e) => {
            const idx = e.target.dataset.idx;
            items.splice(idx, 1);
            renderItems();
        });
    });
}