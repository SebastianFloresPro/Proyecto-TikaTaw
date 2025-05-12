import express from 'express';
import db from '../public/data/db.js'; // Asegúrate de que este archivo esté usando pg y no mysql

const router = express.Router();

router.post('/', (req, res) => {
    const { correo, password } = req.body;

    // Verificación de usuario
    db.query('SELECT * FROM usuarios WHERE "Correo" = $1', [correo], (err, results) => { // Usando PostgreSQL y parámetros correctamente
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).send('Error del servidor');
        }

        if (results.rows.length > 0) { // Cambié 'results.length' a 'results.rows.length' en PostgreSQL
            const usuario = results.rows[0];
            if (password !== usuario.Password) {
                return res.status(400).send('Contraseña incorrecta');
            }

            req.session.user = { id: usuario.ID, tipo: 'usuario' };
            return res.redirect(`/perfil/${usuario.ID}`);
        }

        // Verificación de refugio
        db.query('SELECT * FROM refugios WHERE "Correo" = $1', [correo], (err, refugioResults) => {
            if (err) {
                console.error('Error en login (refugios):', err);
                return res.status(500).send('Error del servidor');
            }

            if (refugioResults.rows.length > 0) { // Cambié 'refugioResults.length' a 'refugioResults.rows.length'
                const refugio = refugioResults.rows[0];
                if (password !== refugio.Password) {
                    return res.status(400).send('Contraseña incorrecta');
                }

                req.session.user = { id: refugio.IdRefugio, tipo: 'refugio' };
                return res.redirect(`/perfil/${refugio.IdRefugio}`);
            }

            return res.status(400).send('Correo no registrado');
        });
    });
});

export default router;