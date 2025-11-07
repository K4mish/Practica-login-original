const API_URL = 'http://localhost:3000/api/users';
const tableBody = document.getElementById('userTableBody');
const modal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.getElementById('closeModal');
const token = localStorage.getItem('token');

if (!token) {
    alert('Inicia sesión como administrador.');
    window.location.href = '../pages/login.html';
}
//Funcion para cargar los usuarios
async function loadUsers() {
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error al cargar usuarios');
        }
        const users = await res.json();
        tableBody.innerHTML = '';

        users.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.rol}</td>
                <td>
                    <button onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.rol}')">Editar</button>
                    <button onclick="deleteUser(${user.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert('Error al cargar usuarios: ' + error.message);
        window.location.href = '../pages/login.html';
    }
}
//Mensaje de confirmacion para eliminar usuario
async function deleteUser(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadUsers();
    }
}
//Editar usuario (modal)
function openEditUser(id, name, email, rol) {
    modal.style.display = 'flex';
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRol').value = rol;
}
//Guardar cambios del usuario editado
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const rol = document.getElementById('editRol').value;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({name, email, rol}),
    });
    modal.style.display = 'none';
    loadUsers();
});
//Evento para que el usuario pueda cerrar el modal manualmente
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});
//Cargar los usuarios al iniciar la pagina
loadUsers();