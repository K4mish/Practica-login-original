document.getElementById("formRegister").addEventListener("submit", async(e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, email, password})
    });
    const data = await response.json();
    if(response.ok) {
        alert(data.message); //Mensaje exitoso de registro
        document.getElementById("formRegister").reset(); //Limpia el formulario con la funcion reset
        window.location.href = "../pages/login.html"; //Redirige a la pagina login
    } else {
        alert(data.message || "Error al registrar");
    }
});