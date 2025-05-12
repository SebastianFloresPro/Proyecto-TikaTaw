import express from 'express';
import db from '../public/data/db.js';
import multer from 'multer';

const router = express.Router();

// Configurar multer para procesar archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Permitir dos archivos opcionales: logo y portada
const subirForm = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'portada', maxCount: 1 }
]);

router.post('/', subirForm, async (req, res) => {
  try {
    const { rubro, nombreContacto, nombreEstablecimiento, telefono, correo, password } = req.body;

    // Validar campos obligatorios
    if (!nombreEstablecimiento || !correo || !password || !telefono) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    // Preparar la consulta SQL para insertar el refugio
    const sql = `INSERT INTO refugios (
      "Rubro", "NombreContacto", "NombreEstablecimiento", 
      "Telefono", "Correo", "Password"
    ) VALUES ($1, $2, $3, $4, $5, $6)`;

    console.log('Datos recibidos:', {
      rubro,
      nombreContacto,
      nombreEstablecimiento,
      telefono,
      correo
    });

    // Ejecutar la consulta SQL
    db.query(sql, [
      rubro,
      nombreContacto,
      nombreEstablecimiento,
      telefono,
      correo,
      password // No se cifra la contraseña
    ], (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).send('Error al registrar');
      }
      res.send('Refugio registrado con éxito');
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;
