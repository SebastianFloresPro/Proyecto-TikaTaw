// routes/usuarios.js
import express from 'express';
import db from '../config/database.js';
import bcrypt from 'bcrypt';  // Asegúrate de importar bcrypt correctamente
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  // Validación básica
  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ message: "Por favor llena todos los campos." });
  }

  // Validación de formato de correo electrónico
  if (!correo.includes("@") || !correo.includes(".")) {
    return res.status(400).json({ message: "Correo no válido." });
  }

  // Verificar si el correo ya existe
  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    // Hash de la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar el nuevo usuario en la base de datos
    await db.execute(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
      [nombre, correo, hashedPassword]
    );

    return res.status(200).json({ message: "¡Usuario registrado con éxito!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrió un error al registrar el usuario." });
  }
});

export default router;
