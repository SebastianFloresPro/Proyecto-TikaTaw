/*document.addEventListener("DOMContentLoaded", () => {
    console.log("Login.js cargado");
  
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
  */

  import express from 'express';
  import db from '../config/database.js';
  import bcrypt from 'bcrypt';
  
  const router = express.Router();
  
  router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
  
   
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
  
  export default router;