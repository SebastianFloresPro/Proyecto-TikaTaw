document.addEventListener("DOMContentLoaded", () => {
    console.log("RegisterRefugio.js cargado");
  
    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const nombrecentro = document.querySelector("input[name='nombrecentro']").value.trim();
        const adopcion = document.querySelector("select[name='adopcion']").value;
        const nombreencargado = document.querySelector("input[name='nombreencargado']").value.trim();
        const telefono = document.querySelector("input[name='telefono']").value.trim();
        const correo = document.querySelector("input[name='correo']").value.trim();
        const contrasena = document.querySelector("input[name='contrasena']").value.trim();
        const redesociales = document.querySelector("input[name='redesociales']").value.trim();
        const logo = document.querySelector("input[name='logo']").files[0];
        const portada = document.querySelector("input[name='portada']").files[0];
  
        // Validacion basica
        if (!nombrecentro || !adopcion || !nombreencargado || !telefono || !correo || !contrasena || !redesociales) {
          alert("Por favor llena todos los campos requeridos.");
          return;
        }
  
        // Validacion de nombre del centro
        if (nombrecentro.length < 3) {
          alert("El nombre del centro debe tener al menos 3 caracteres.");
          return;
        }
  
        // Validacion de nombre del encargado
        if (nombreencargado.length < 3) {
          alert("El nombre del encargado debe tener al menos 3 caracteres.");
          return;
        }
  
        // Validacion de teléfono
        if (!/^\d{9,15}$/.test(telefono)) {
          alert("Teléfono no válido.");
          return;
        }
  
        // Validacion de correo
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(correo)) {
          alert("Correo no válido.");
          return;
        }
  
        // Validacion de contraseña
        if (contrasena.length < 6) {
          alert("La contraseña debe tener al menos 6 caracteres.");
          return;
        }
  
        // Validacion de redes sociales
        if (redesociales.length < 3) {
          alert("Las redes sociales deben tener al menos 3 caracteres.");
          return;
        }
  
        // Crear FormData para enviar datos y archivos
        const formData = new FormData();
        formData.append("nombrecentro", nombrecentro);
        formData.append("adopcion", adopcion);
        formData.append("nombreencargado", nombreencargado);
        formData.append("telefono", telefono);
        formData.append("correo", correo);
        formData.append("contrasena", contrasena);
        formData.append("redesociales", redesociales);
        if (logo) formData.append("logo", logo);
        if (portada) formData.append("portada", portada);
  
        try {
          const response = await fetch("/api/registerrefugio", {
            method: "POST",
            body: formData
          });
  
          const data = await response.json();
          alert(data.message);
          if (response.ok) {
            form.reset();
            document.getElementById("exito").style.display = "block";
            setTimeout(() => {
              document.getElementById("exito").style.display = "none";
              window.location.href = '/login';
            }, 2000);
          }
        } catch (error) {
          console.error("Error al registrar el refugio:", error);
          alert("Ocurrió un error al registrar el refugio.");
        }
      });
    }
  });