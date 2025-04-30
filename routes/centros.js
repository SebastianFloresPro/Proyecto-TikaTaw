import express from 'express';
import db from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/registerrefugio', upload.fields([{ name: 'logo' }, { name: 'portada' }]), async (req, res) => {
  const { nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales } = req.body;
  const logo = req.files['logo'] ? `/uploads/${req.files['logo'][0].filename}` : null;
  const portada = req.files['portada'] ? `/uploads/${req.files['portada'][0].filename}` : null;

  // Validacion basica
  if (!nombrecentro || adopcion === undefined || !nombreencargado || !telefono || !correo || !contrasena || !redesociales) {
    return res.status(400).json({ message: "Por favor llena todos los campos requeridos." });
  }

  // Validacion de formato de correo electronico
  if (!correo.includes("@") || !correo.includes(".")) {
    return res.status(400).json({ message: "Correo no válido." });
  }

  // Validacion de adopcion (debe ser booleano)
  const adopcionBool = adopcion === 'true' || adopcion === '1';

  try {
    // Verificar si el correo ya existe
    const [rows] = await db.execute('SELECT * FROM centrosdeadopcion WHERE correo = ?', [correo]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Generar un idcentro unico
    const [idResult] = await db.execute('SELECT MAX(idcentro) as maxId FROM centrosdeadopcion');
    const newId = (idResult[0].maxId || 0) + 1;

    // Insertar el nuevo centro
    await db.execute(
      'INSERT INTO centrosdeadopcion (idcentro, nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newId, nombrecentro, adopcionBool, nombreencargado, telefono, correo, hashedPassword, redesociales]
    );

    return res.status(200).json({ message: "¡Centro registrado con éxito!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrió un error al registrar el centro." });
  }
});

export default router;