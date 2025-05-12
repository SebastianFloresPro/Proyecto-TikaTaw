import express from 'express';
import db from '../public/data/db.js';

const router = express.Router();

router.post('/', (req, res) => {
    const { nombre, edad, correo, telefono, password } = req.body;

    // Validación básica
    if (!nombre || !edad || !correo || !telefono || !password) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    if (edad < 1 || edad > 120) {
    return res.status(400).send('Edad inválida');
    }

    if (!correo.includes('@') || !correo.includes('.')) {
    return res.status(400).send('Correo inválido');
    }

    // Verificar si la conexión está activa
    if (db.state === 'disconnected') {
        db.connect(err => {
            if (err) return res.status(500).send('Error de base de datos');
        });
    }

    const sql = 'INSERT INTO Usuarios SET ?';
    const usuario = { nombre, edad, correo, telefono, password };

    db.query(sql, usuario, (err, result) => {
        if (err) {
            console.error('Error al insertar:', err);
            return res.status(500).send('Error al registrar');
        }
        res.send('Usuario registrado!');
    });
});

export default router;