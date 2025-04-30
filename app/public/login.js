document.addEventListener("DOMContentLoaded", () => {
    console.log("Loginjs cargado");
  
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (!username || !password) {
        e.preventDefault();
        alert("Por favor, completá todos los campos.");
      }
    });
  });