const cartBody = document.getElementById("cartBody");
const totalEl = document.getElementById("total");
const btnCheckout = document.getElementById("btnCheckout");
const metodoPagoEl = document.getElementById("metodo_pago");

function getCart() {
    return JSON.parse(localStorage.getItem("cart") || '[]')};
function saveCart(c) { localStorage.setItem("cart", JSON.stringify(c)); }

function render() {
    const cart = getCart();
    cartBody.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
        const subtotal = Number(item.precio_venta) * Number(item.cantidad);
        total += subtotal;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.producto}</td>
            <td>$${Number(item.precio_venta).toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.cantidad}" data-idx="${idx}" class="qty" style="width:64px"/></td>
            <td>$${Number(subtotal).toFixed(2)}</td>
            <td><button data-idx="${idx}" class="remove">Eliminar</button></td>
        `;
        cartBody.appendChild(tr);
    });
    totalEl.textContent = total.toFixed(2);
    document.querySelectorAll(".qty").forEach(input => {
        input.addEventListener("change", (e) => {
            const idx = e.target.dataset.idx;
            const v = Math.max(1, Number(e.target.value));
            const cart = getCart();
            cart[idx].cantidad = v;
            saveCart(cart);
            render();
        });
    });
    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.target.dataset.idx;
            const cart = getCart();
            cart.splice(idx, 1);
            saveCart(cart);
            render();
        });
    });
}

btnCheckout.addEventListener("click", async() => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debe iniciar sesion para pagar");
        window.location.href = "/pages/login.html";
        return;
    }
    const cart = getCart();
    if (cart.length === 0) { alert("El carrito está vacío."); return; }
    // Preparar payload de items
    const items = cart.map(i => ({ productId: i.id, cantidad: Number(i.cantidad) }));
    const metodo_pago = metodoPagoEl.value;
    try {
        const res = await fetch("http://localhost:3000/api/ventas", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ items, metodo_pago })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al procesar la compra");
        localStorage.removeItem("cart");
        alert('Pago exitoso. ID de la venta: ' + data.venta_id);
        window.location.href = "/pages/catalogo.html";
    } catch (err) {
        alert("Error al procesar la compra: " + err.message);
}
});
render();