document.getElementById("registerBtn").addEventListener("click", function () {
    const newUsername = document.getElementById("newUsername").value.trim();

    if (!newUsername) {
        alert("Por favor, ingresa un nombre de usuario.");
        return;
    }

    // Verificar si el usuario ya existe
    fetch(`http://localhost:5000/users?name=${newUsername}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                alert("Este usuario ya está registrado.");
            } else {
                // 🔹 Generamos un nuevo ID correctamente asegurándonos de que es un número
                fetch("http://localhost:5000/users")
                    .then(response => response.json())
                    .then(users => {
                        const newId = users.length > 0 ? Math.max(...users.map(user => parseInt(user.id, 10))) + 1 : 1;

                        // 🔹 Ahora sí registramos el usuario con el ID correcto
                        fetch("http://localhost:5000/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ id: newId, name: newUsername })
                        })
                        .then(response => response.json())
                        .then(user => {
                            alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
                            window.location.href = "index.html"; // Redirigir a inicio de sesión
                        })
                        .catch(error => console.error("Error en el registro:", error));
                    });
            }
        })
        .catch(error => console.error("Error en la verificación de usuario:", error));
});
