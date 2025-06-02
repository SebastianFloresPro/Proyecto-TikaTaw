const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/mascotas-public', (req, res) => {
    const sql = `
        SELECT mascota.idmascota, mascota.nombre, mascota.edad, mascota.descripcion, mascota.foto, centrosdeadopcion.nombrecentro 
        FROM mascota 
        JOIN centrosdeadopcion ON mascota.idcentro = centrosdeadopcion.idcentro
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas públicas:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

router.get('/', (req, res) => {
    const sql = `
        SELECT idmascota, nombre, especie 
        FROM mascota
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});
router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Solicitando mascota con ID: ${id}`);
    const sql = `
        SELECT mascota.*, centrosdeadopcion.nombrecentro 
        FROM mascota 
        JOIN centrosdeadopcion ON mascota.idcentro = centrosdeadopcion.idcentro 
        WHERE idmascota = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener mascota:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener mascota', error: err.message });
        }
        if (results.length === 0) {
            console.error(`Mascota con ID ${id} no encontrada`);
            return res.status(404).json({ success: false, message: 'Mascota no encontrada' });
        }
        console.log('Mascota encontrada:', results[0]);
        res.json({ success: true, mascota: results[0] });
    });
});

router.post('/solicitar-adopcion', (req, res) => {
    const { mascotaId, motivo, experiencia } = req.body;

    if (!req.session.userId || !req.session.tipo || req.session.tipo !== 'usuario') {
        return res.status(401).json({ success: false, message: 'Debes iniciar sesión como usuario para solicitar adopción' });
    }

    const idusuario = req.session.userId;

    const sql = 'INSERT INTO solicitudes (idusuario, idmascota, fecha, estado, motivo, experiencia) VALUES (?, ?, NOW(), "pendiente", ?, ?)';
    db.query(sql, [idusuario, mascotaId, motivo, experiencia], (err, result) => {
        if (err) {
            console.error('Error al registrar la solicitud:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar la solicitud' });
        }
        console.log('Solicitud registrada con ID:', result.insertId); 
        res.json({ success: true, message: 'Solicitud de adopción registrada exitosamente' });
    });
});

module.exports = router;