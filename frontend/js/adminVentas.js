const token = localStorage.getItem('token');
if (!token) { alert('Inicia sesión.'); window.location.href = '../pages/login.html'; };

const API_URL = 'http://localhost:3000/api';
const clienteSelect = document.getElementById("clientSelect");
const productoSelect = document.getElementById("productoSelect");
const cantidadInput = document.getElementById("cantidad");
const btnAdd = document.getElementById("btnAdd");
const itemsBody = document.getElementById("itemsBody");
const AdminTotalEl = document.getElementById("adminTotal");
const btnSubmit = document.getElementById("btnSubmit");
const historialDiv = document.getElementById("historial");
const adminMetodo = document.getElementById("admin_metodo_pago");

let items = [];
let productsCache = [];

// Cargar usuarios, clientes y productos
async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudieron cargar los usuarios. Token inválido o sin permisos.');
        
        const data = await res.json();
        clienteSelect.innerHTML = data.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('');
    } catch (error) {
        console.error('Error en loadUsers:', error);
        alert(error.message);
    }
}
// Cargar productos
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudieron cargar los productos. Token inválido o sin permisos.');

        const data = await res.json();
        productsCache = data;
        productoSelect.innerHTML = data.map(p => `<option value="${p.id}" data-price="${p.precio_venta}">${p.producto} - $${Number(p.precio_venta).toFixed(2)} (Stock: ${p.stock})</option>`).join('');
    } catch (error) {
        console.error('Error en loadProducts:', error);
        alert(error.message);
    }
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
    AdminTotalEl.textContent = `$ ${Number(total).toFixed(2)}`;
    
    document.querySelectorAll(".remove").forEach(b => {
        b.addEventListener("click", (e) => {
            const idx = e.target.dataset.idx;
            items.splice(idx, 1);
            renderItems();
        });
    });
}
btnAdd.addEventListener("click", () => {
    const pId = Number(productoSelect.value);
    const product = productsCache.find(p => Number(p.id) === pId);
    const div = Math.max(1, Number(cantidadInput.value));
    if (!product) return alert('Producto no encontrado.');
    if (div > product.stock) return alert('Cantidad excede el stock disponible.');
    items.push({ productId: pId, producto: product.producto, cantidad: div, precio_unitario: Number(product.precio_venta) });
    renderItems();
});

btnSubmit.addEventListener("click", async () => {
    if (items.length === 0) return alert('Agrega al menos un producto a la venta.');
    const cliente_id = Number(clienteSelect.value);
    const metodo_pago = adminMetodo.value;
    const payload = { cliente_id, items: items.map(i => ({
        productId: i.productId, cantidad: i.cantidad
    })), metodo_pago };
    try {
        const res = await fetch(`http://localhost:3000/api/ventas/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al registrar la venta.');
        alert('Venta registrada ID: ' + data.ventaId);
        items = [];
        await loadProducts();
        renderItems();
        loadHistorial();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

async function loadHistorial() {
    const res = await fetch(`http://localhost:3000/api/ventas`, {headers: { 'Authorization': `Bearer ${token}` }});
    const data = await res.json();
    historialDiv.innerHTML = data.map(v => `
        <div>
            <strong>ID ${v.id}</strong> Cliente: ${v.cliente_nombre || v.cliente_id} - Total: $${Number(v.total).toFixed(2)} - Método: ${v.metodo_pago} - Creado por: ${v.creado_por_nombre || v.creado_por}
            <button data-id="${v.id}" class="viewDetails">Ver Detalles</button>
        </div>`
    ).join('');
    document.querySelectorAll(".viewDetails").forEach(b => {
        b.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const r = await fetch(`http://localhost:3000/api/ventas/${id}`, {headers: { 'Authorization': `Bearer ${token}` }});
            const j = await r.json();
            if (!r.ok) { alert(j.message || "Error"); return; }
            // Mostrar detalles
            const detalleTexto = j.detalle.map(d => `${d.producto_nombre} X ${d.cantidad} = $${d.subtotal}`).join('\n');
            alert("Detalle: \\n" + detalleTexto);
        });
    });
}

// Inicializar
async function init() {
    await loadUsers();
    await loadProducts();
    await loadHistorial();
}
init();