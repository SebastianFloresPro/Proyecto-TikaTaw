const express = require('express');
const router = express.Router();
const db = require('../config/database');
const path = require('path');
const multer = require('multer');

// Mostrar formulario de registro de usuarios
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

// Procesar registro de usuarios
router.post('/register', (req, res) => {
    const { nombre, edad, correo, telefono, password } = req.body;
    
    const sql = 'insert into usuario (nombre, edad, correo, telefono, contrasena) values (?, ?, ?, ?, ?)';

    db.query(sql, [nombre, edad, correo, telefono, password], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.json({ success: false, message: 'Error al registrar usuario' });
        }
        res.json({ success: true, message: 'Usuario registrado exitosamente' });
    });
});

// Mostrar formulario de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Procesar login para usuarios y refugios
router.post('/login', (req, res) => {
    if (req.session.userId) {
        // Si ya hay una sesión activa, no es necesario hacer login nuevamente
        return res.json({ success: true, tipo: req.session.tipo });
    }

    const { correo, password } = req.body;

    // Buscar en tabla de usuarios
    const sqlUsuario = 'SELECT idusuario, nombre FROM usuario WHERE correo = ? AND contrasena = ?';
    db.query(sqlUsuario, [correo, password], (err, resultsUsuario) => {
        if (err) {
            console.error('Error al iniciar sesión (usuario):', err);
            return res.json({ success: false, message: 'Error del servidor' });
        }

        if (resultsUsuario.length > 0) {
            const usuario = resultsUsuario[0];
            req.session.userId = usuario.idusuario;
            req.session.tipo = 'usuario';
            return res.json({ success: true, tipo: 'usuario' });
        }

        // Si no está en usuarios, buscar en refugios
        const sqlRefugio = 'SELECT idcentro, nombrecentro FROM centrosdeadopcion WHERE correo = ? AND contrasena = ?';
        db.query(sqlRefugio, [correo, password], (err, resultsRefugio) => {
            if (err) {
                console.error('Error al iniciar sesión (refugio):', err);
                return res.json({ success: false, message: 'Error del servidor' });
            }

            if (resultsRefugio.length > 0) {
                const refugio = resultsRefugio[0];
                req.session.userId = refugio.idcentro;
                req.session.tipo = 'refugio';
                return res.json({ success: true, tipo: 'refugio' });
            }

            return res.json({ success: false, message: 'Correo o contraseña incorrectos' });
        });
    });
});


// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
        res.json({ success: true, message: 'Sesión cerrada exitosamente' }); // Respuesta al frontend
    });
});

router.get('/api/auth/check', (req, res) => {
    if (req.session.userId && req.session.tipo) {
        res.json({ isValid: true, tipo: req.session.tipo });
    } else {
        res.json({ isValid: false });
    }
});

module.exports = router;
