document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // evita que se envíe automáticamente
  
      const nombre = document.querySelector("#nombre").value.trim();
      const correo = document.querySelector("#correo").value.trim();
      const contraseña = document.querySelector("#password").value.trim();
      const confirmar = document.querySelector("#confirmar").value.trim();
  
      if (!nombre || !correo || !contraseña || !confirmar) {
        alert("Por favor llena todos los campos.");
        return;
      }
  
      if (!correo.includes("@") || !correo.includes(".")) {
        alert("Correo no válido.");
        return;
      }
  
      if (contraseña !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
      }
  
      // Si todo es válido, enviamos los datos
      fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña })
      })
      .then(res => res.json())
      .then(data => {
        alert("¡Usuario registrado con éxito!");
        form.reset();
      })
      .catch(err => {
        console.error("Error al registrar:", err);
        alert("Ocurrió un error al registrar.");
      });
    });
  });