document.addEventListener("DOMContentLoaded", function () {
    const submitPostBtn = document.getElementById("submitPostBtn");

    submitPostBtn.addEventListener("click", function () {
        const postTitle = document.getElementById("postTitle").value.trim();
        const postContent = document.getElementById("postContent").value.trim();
        const user = JSON.parse(localStorage.getItem("user")); // Obtener usuario autenticado

        if (!postTitle || !postContent) {
            alert("Por favor, llena todos los campos.");
            return;
        }

        // Obtener el último ID de los posts y sumarle 1
        fetch("http://localhost:5000/posts")
            .then(response => response.json())
            .then(posts => {
                const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;

                // Crear el nuevo post
                fetch("http://localhost:5000/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: newId,
                        title: postTitle,
                        body: postContent,
                        userId: user.id // Asociar el post al usuario autenticado
                    })
                })
                .then(response => response.json())
                .then(() => {
                    alert("Post añadido con éxito.");
                    window.location.href = "index.html"; // Volver a la página principal
                })
                .catch(error => console.error("Error al guardar el post:", error));
            });
    });
});
