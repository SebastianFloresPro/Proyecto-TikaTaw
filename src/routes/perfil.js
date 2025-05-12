import express from 'express';
import db from '../public/data/db.js';

const router = express.Router();

router.get('/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const id = req.params.id;

    // 🚨 Verifica que solo pueda ver su propio perfil
    if (parseInt(id) !== req.session.user.id) {
        return res.redirect(`/perfil/${req.session.user.id}`);
    }

    db.query('SELECT * FROM usuarios WHERE ID = ?', [id], (err, userResults) => {
        if (err) return res.status(500).send('Error del servidor');

        if (userResults.length > 0) {
            const usuario = userResults[0];
            return res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Perfil de Usuario</title>
                    <link rel="stylesheet" href="/css/perfil.css">
                </head>
            <body>
                <div class="container">
                    <h1>Perfil de Usuario</h1>
                    <div class="profile-info">
                        <p><strong>Nombre:</strong> ${usuario.Nombre}</p>
                        <p><strong>Email:</strong> ${usuario.Correo}</p>
                    </div>
                    <div class="actions">
                        <a href="/inicio" class="btn">Inicio</a>
                        <a href="/logout" class="btn logout">Cerrar sesión</a>
                    </div>
                </div>
            </body>
            </html>
            `);
        }

        db.query('SELECT * FROM refugios WHERE IdRefugio = ?', [id], (err, refugioResults) => {
            if (err) return res.status(500).send('Error del servidor');

            if (refugioResults.length > 0) {
                const refugio = refugioResults[0];
                return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Perfil de Refugio</title>
                    <link rel="stylesheet" href="/css/perfil.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Perfil de Refugio</h1>
                        <div class="profile-info">
                            <p><strong>Rubro:</strong> ${refugio.Rubro || 'No disponible'}</p>
                            <p><strong>Nombre del Contacto:</strong> ${refugio.NombreContacto || 'No disponible'}</p>
                            <p><strong>Nombre del Establecimiento:</strong> ${refugio.NombreEstablecimiento || 'No disponible'}</p>
                            <p><strong>Teléfono:</strong> ${refugio.Telefono || 'No disponible'}</p>
                            <p><strong>Correo:</strong> ${refugio.Correo || 'No disponible'}</p>
                            <p><strong>Redes Sociales:</strong> ${refugio.RedesSociales || 'No disponible'}</p>
                            <p><strong>Descripción:</strong> ${refugio.Descripcion || 'No disponible'}</p>
                            <p><strong>Información Adicional:</strong> ${refugio.InfoAdicional || 'No disponible'}</p>
                        </div>
                        <div class="actions">
                            <a href="/inicio" class="btn">Inicio</a>
                            <a href="/logout" class="btn logout">Cerrar sesión</a>
                        </div>
                    </div>
                </body>
                </html>
                            `);
            }

            return res.status(404).send('Perfil no encontrado');
        });
    });
});

export default router;
