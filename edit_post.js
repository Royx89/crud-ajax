document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    console.log("Post ID recibido:", postId); // Verificar si el ID es correcto

    if (!postId) {
        alert("No se encontró el post a editar.");
        window.location.href = "index.html";
        return;
    }

    const editTitle = document.getElementById("editTitle");
    const editBody = document.getElementById("editBody");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    // 🔹 Cargar el post seleccionado
    fetch(`http://localhost:5000/posts/${postId}`)
        .then(response => {
            console.log("Respuesta del servidor:", response.status); // Verificar respuesta
            if (!response.ok) {
                throw new Error("Post no encontrado");
            }
            return response.json();
        })
        .then(post => {
            console.log("Datos del post:", post); // Ver si se obtiene bien
            editTitle.value = post.title;
            editBody.value = post.body;

            // Guardar el userId en una variable para enviarlo luego
            localStorage.setItem("editUserId", post.userId);
        })
        .catch(error => {
            console.error("Error al cargar el post:", error);
            alert("El post no existe o hubo un problema al cargarlo.");
            window.location.href = "index.html";
        });

    // 🔹 Guardar cambios en el post
    saveEditBtn.addEventListener("click", function () {
        const updatedPost = {
            id: parseInt(postId), // Asegura que incluya el ID del post
            title: editTitle.value,
            body: editBody.value,
            userId: parseInt(localStorage.getItem("editUserId")) // Mantiene el userId correcto
        };

        fetch(`http://localhost:5000/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPost)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la actualización");
            }
            return response.json();
        })
        .then(() => {
            alert("Publicación actualizada con éxito.");
            window.location.href = "index.html";
        })
        .catch(error => console.error("Error al actualizar el post:", error));
    });

    // 🔹 Cancelar edición
    cancelEditBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });
});
