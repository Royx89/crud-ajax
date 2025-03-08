document.addEventListener("DOMContentLoaded", function () {
    const loginSection = document.getElementById("loginSection");
    const userSection = document.getElementById("userSection");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const addPostBtn = document.getElementById("addPostBtn");
    const userNameSpan = document.getElementById("userName");
    const userDataList = document.getElementById("userData");
    const userPostsList = document.getElementById("userPostsList");

    // Recuperar usuario si ya está autenticado
    let user = localStorage.getItem("user");
    if (user) {
        user = JSON.parse(user);
        mostrarUsuario(user);
    }

    // Manejar inicio de sesión
    loginBtn.addEventListener("click", function () {
        const username = document.getElementById("usernameLogin").value.trim();
        const loginError = document.getElementById("loginError");

        if (!username) {
            loginError.textContent = "Por favor, ingresa tu nombre de usuario.";
            loginError.style.display = "block";
            return;
        }

        fetch(`http://localhost:5000/users?name=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const user = data[0];
                    localStorage.setItem("user", JSON.stringify(user));
                    loginError.style.display = "none";
                    mostrarUsuario(user);
                } else {
                    loginError.textContent = "Usuario no encontrado.";
                    loginError.style.display = "block";
                }
            })
            .catch(error => {
                console.error("Error en autenticación:", error);
                loginError.textContent = "Error al conectar con el servidor.";
                loginError.style.display = "block";
            });
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("user");
        location.reload();
    });

    function mostrarUsuario(user) {
        loginSection.style.display = "none";
        userSection.style.display = "block";
        userNameSpan.textContent = user.name;

        userDataList.innerHTML = `
            <li>ID: ${user.id}</li>
            <li>Nombre: ${user.name}</li>
        `;

        // Limpiar la lista antes de añadir nuevas publicaciones
        userPostsList.innerHTML = "";

        // Obtener y mostrar los posts del usuario
        fetch(`http://localhost:5000/posts?userId=${user.id}`)
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0) {
                    userPostsList.innerHTML = "<p>No tienes publicaciones aún.</p>";
                } else {
                    posts.forEach(post => {
                        userPostsList.innerHTML += `
                            <li>
                                <h4>${post.title}</h4>
                                <p>${post.body}</p>
                            </li>
                        `;
                    });
                }
            })
            .catch(error => console.error("Error al cargar los posts:", error));
    }
});
