/*import express from 'express';
import db from '../config/database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  // Validación básica
  if (!correo || !password) {
    return res.status(400).json({ message: "Por favor llena todos los campos." });
  }

  try {
    // Buscar usuario por correo
    const [rows] = await db.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    // Verificar contraseña
    const match = await bcrypt.compare(password, user.clave);
    if (!match) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    return res.status(200).json({ message: "¡Inicio de sesión exitoso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrió un error al iniciar sesión." });
  }
});

export default router*/

document.addEventListener("DOMContentLoaded", () => {
    console.log("Login.js cargado");
  
    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevenir el envío por defecto del formulario
  
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();
  
        // Validacion basica 
        if (!correo || !password) {
          alert("Por favor, completá todos los campos.");
          return;
        }
  
        // Validacipn adicional para el formato de correo
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(correo)) {
          alert("Correo no válido.");
          return;
        }
  
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
          });
  
          const data = await response.json();
          alert(data.message);
          if (response.ok) {
            form.reset();
            window.location.href = '/inicio';
          }
        } catch (error) {
          console.error("Error al iniciar sesión:", error);
          alert("Ocurrió un error al iniciar sesión.");
        }
      });
    }
  });