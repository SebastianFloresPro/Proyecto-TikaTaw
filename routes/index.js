const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');
const multer = require('multer');

// Mostrar index
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// Mostrar about
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

// Mostrar contact
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
});

// Mostrar busqueda
router.get('/busqueda', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'busqueda.html'));
});

// Mostrar favoritos
router.get('/favoritos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'favoritos.html'));
});

// Mostrar formulario para registrar mascota
router.get('/mascotas/registermascota', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'mascota.html'));
});

// Procesar registro de mascota
router.post('/mascotas/registermascota', (req, res) => {
    const { idcentro, nombre, tamanio, especie, edad, genero, descripcion } = req.body;

    const sql = 'INSERT INTO mascota (idcentro, nombre, tamanio, especie, edad, genero, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [idcentro, nombre, tamanio, especie, edad, genero, descripcion], (err, result) => {
        if (err) {
            console.error('Error al registrar mascota:', err);
            res.json({ success: false, message: 'Error al registrar mascota' });
            return;
        }
        const newId = result.insertId; // ID generado por MySQL
        res.json({ success: true, message: 'Mascota registrada exitosamente', idmascota: newId });
    });
});

// Obtener mascotas
router.get('/mascotas', (req, res) => {
    const sql = 'SELECT * FROM mascota';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas:', err);
            res.json({ success: false, message: 'Error al obtener mascotas' });
            return;
        }
        res.json({ success: true, mascotas: results });
    });
});

// Exportar las rutas para que se usen en app.js
module.exports = router;
