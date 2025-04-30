/*
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value.trim();
    const correo = document.querySelector("#email").value.trim(); // <-- CORREGIDO
    const contraseña = document.querySelector("#password").value.trim();
    const confirmar = document.querySelector("#confirmar").value.trim();

    if (!nombre || !correo || !contraseña || !confirmar) {
      alert("Por favor llena todos los campos.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(correo)) {
      alert("Correo no válido.");
      return;
    }

    if (contraseña !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Aquí solo funcionará si tienes backend configurado
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contraseña })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
      } else {
        alert("Registro exitoso");
      }
      form.reset();
    })
    .catch(err => {
      console.error("Error al registrar:", err);
      alert("Ocurrió un error al registrar.");
    });
  });
});
*/document.addEventListener("DOMContentLoaded", () => {
  console.log("Register.js cargado");

  const form = document.querySelector("form");
  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Seleccionar los campos
    const nombreInput = document.querySelector("#nombre");
    const edadInput = document.querySelector("#edad");
    const correoInput = document.querySelector("#correo");
    const telefonoInput = document.querySelector("#telefono");
    const passwordInput = document.querySelector("#password");
    const confirmarInput = document.querySelector("#confirmar");

    // Verificar que los campos existan
    if (!nombreInput || !edadInput || !correoInput || !telefonoInput || !passwordInput || !confirmarInput) {
      console.error("Uno o más campos del formulario no se encontraron");
      console.log({
        nombreInput: !!nombreInput,
        edadInput: !!edadInput,
        correoInput: !!correoInput,
        telefonoInput: !!telefonoInput,
        passwordInput: !!passwordInput,
        confirmarInput: !!confirmarInput
      });
      alert("Error: No se encontraron todos los campos del formulario.");
      return;
    }

    // Extraer los valores
    const nombre = nombreInput.value.trim();
    const edad = edadInput.value.trim();
    const correo = correoInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmar = confirmarInput.value.trim();

//elim
    console.log("Datos extraídos del formulario:", { nombre, edad, correo, telefono, password, confirmar });

    // Validaciones
    if (!nombre || !edad || !correo || !telefono || !password || !confirmar) {
      console.log("Campos vacíos detectados");
      alert("Por favor llena todos los campos.");
      return;
    }

    if (nombre.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (isNaN(edad) || edad < 18) {
      alert("Debes ser mayor de 18 años.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(correo)) {
      alert("Correo no válido.");
      return;
    }

    if (!/^\d{9,15}$/.test(telefono)) {
      alert("Teléfono no válido.");
      return;
    }

    if (password !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Enviar datos al backend
    const datosParaEnviar = { nombre, edad, correo, telefono, password };
    console.log("Enviando solicitud a /api/register con datos:", datosParaEnviar);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const data = await response.json();
      alert(data.message);
      if (data.message.includes("éxito")) {
        form.reset();
        window.location.href = '/login';
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      alert("Ocurrió un error al registrar: " + err.message);
    }
  }, { once: true });
});