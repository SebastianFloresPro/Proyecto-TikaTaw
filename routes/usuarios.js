import express from 'express';
import db from '../config/database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log("Solicitud recibida en /api/register");
  console.log("Encabezados:", req.headers);
  console.log("Cuerpo completo de la solicitud:", req.body);

  const { nombre, edad, correo, telefono, password } = req.body;

  console.log(`Registro - Nombre: ${nombre} Edad: ${edad} Email: ${correo} Teléfono: ${telefono} Contraseña: ${password}`);

  if (!nombre || !edad || !correo || !telefono || !password) {
    console.log("Campos faltantes en req.body:", { nombre, edad, correo, telefono, password });
    return res.status(400).json({ message: "Por favor llena todos los campos." });
  }

  if (!correo.includes("@") || !correo.includes(".")) {
    return res.status(400).json({ message: "Correo no válido." });
  }

  if (isNaN(edad) || edad < 18) {
    return res.status(400).json({ message: "Debes ser mayor de 18 años." });
  }

  if (!/^\d{9,15}$/.test(telefono)) {
    return res.status(400).json({ message: "Teléfono no válido." });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO usuario (nombre, edad, correo, telefono, clave) VALUES (?, ?, ?, ?, ?)',
      [nombre, edad, correo, telefono, hashedPassword]
    );

    return res.status(200).json({ message: "¡Usuario registrado con éxito!" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Ocurrió un error al registrar el usuario: " + error.message });
  }
});

export default router;