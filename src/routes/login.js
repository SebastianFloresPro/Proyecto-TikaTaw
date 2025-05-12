
import express from 'express';
import db from '../public/data/db.js';

const router = express.Router();


router.post('/', (req, res) => {
    const { correo, password } = req.body;

    // Verificación de usuario
    db.query('SELECT * FROM usuarios WHERE Correo = ?', [correo], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).send('Error del servidor');
        }

        if (results.length > 0) {
            const usuario = results[0];
            if (password !== usuario.Password) {
                return res.status(400).send('Contraseña incorrecta');
            }
            
            // Solo añade esta línea para guardar sesión
            req.session.user = { id: usuario.ID, tipo: 'usuario' };
            
            return res.redirect(`/perfil/${usuario.ID}`);
        }

        // Verificación de refugio (mismo cambio)
        db.query('SELECT * FROM refugios WHERE Correo = ?', [correo], (err, refugioResults) => {
            if (err) {
                console.error('Error en login (refugios):', err);
                return res.status(500).send('Error del servidor');
            }

            if (refugioResults.length > 0) {
                const refugio = refugioResults[0];
                if (password !== refugio.Password) {
                    return res.status(400).send('Contraseña incorrecta');
                }
                
                // Guardar sesión para refugio
                req.session.user = { id: refugio.IdRefugio, tipo: 'refugio' };
                
                return res.redirect(`/perfil/${refugio.IdRefugio}`);
            }

            return res.status(400).send('Correo no registrado');
        });
    });
});

export default router;