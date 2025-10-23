document.getElementById("formLogin").addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });
    const data = await response.json();
    alert(data.message);
    if(data.token) {
        localStorage.setItem("token", data.token);
        if(data.rol === "admin") {
            window.location.href = "../pages/admin.html"
        } else {
            window.location.href = "../pages/cliente.html"
        }
    }
});