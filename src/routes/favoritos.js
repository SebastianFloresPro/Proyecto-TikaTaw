import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../public/data/db.js';

const router = express.Router();

// Configurar __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta para mostrar favoritos.html
router.get('/favoritos', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'favoritos.html'));
});

// Ruta para agregar favorito
router.post('/favoritos/agregar', (req, res) => {
  const { gato } = req.body;
  const usuario = req.session.user ? req.session.user.nombre : 'UsuarioTest'; // Usar el nombre del usuario autenticado

  const sql = 'INSERT INTO Favoritos (Usuario, NombreGato) VALUES ($1, $2)';
  db.query(sql, [usuario, gato], (err, result) => {
    if (err) {
      console.error('Error al guardar favorito:', err);
      return res.status(500).send('Error interno');
    }
    res.redirect('/favoritos');
  });
});

// Ruta para listar favoritos en formato JSON
router.get('/favoritos/listar', (req, res) => {
  const usuario = req.session.user ? req.session.user.nombre : 'UsuarioTest'; // Usar el nombre del usuario autenticado

  const sql = 'SELECT * FROM Favoritos WHERE "Usuario" = $1 ORDER BY "FechaAgregado" DESC';
  db.query(sql, [usuario], (err, results) => {
    if (err) {
      console.error('Error al listar favoritos:', err);
      return res.status(500).json([]);
    }
    res.json(results.rows); // 'results.rows' es donde están los datos en PostgreSQL
  });
});

export default router;