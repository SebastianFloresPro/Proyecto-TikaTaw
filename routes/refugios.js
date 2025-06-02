const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('../config/database');
//img¿?
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/registerrefugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'registerrefugio.html'));
});

router.post('/registerrefugio', (req, res) => {
    const { nombreencargado, nombrecentro, telefono, correo, redesociales, contrasena } = req.body;
    const adopcion = true;

    const sql = 'INSERT INTO centrosdeadopcion (nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena, redesociales) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombrecentro, adopcion, nombreencargado, telefono, correo, contrasena || '123', redesociales], (err, result) => {
        if (err) {
            console.error('Error al registrar refugio:', err);
            return res.json({ success: false, message: 'Error al registrar refugio' });
        }
        const newId = result.insertId;
        res.json({ success: true, message: 'Refugio registrado exitosamente', idcentro: newId });
    });
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'refugios.html'));
});

router.get('/refugios', (req, res) => {
    const sql = 'SELECT * FROM centrosdeadopcion';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener refugios:', err);
            return res.json({ success: false, message: 'Error al obtener refugios' });
        }
        res.json({ success: true, refugios: results });
    });
});

router.get('/refugio', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/refugio.html'));
});

router.get('/mascotas/:idcentro', (req, res) => {
    const idcentro = req.params.idcentro;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';
    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas del refugio:', err);
            return res.json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

router.post('/login', (req, res) => {
    const { correo, password } = req.body;

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


router.get('/perfil/refugio', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.redirect('/usuarios/login');
    }
    res.sendFile(path.join(__dirname, '../views', 'perfilRefugio.html'));
});

router.get('/api/perfil', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.json({ success: false, message: 'Debe iniciar sesión como refugio' });
    }

    const sql = 'SELECT * FROM centrosdeadopcion WHERE idcentro = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Error al obtener perfil de refugio:', err);
            return res.json({ success: false, message: 'Error al obtener perfil' });
        }
        if (results.length > 0) {
            res.json({ success: true, refugio: results[0] });
        } else {
            res.json({ success: false, message: 'No se encontró el refugio' });
        }
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Sesión cerrada exitosamente' });
    });
});

router.post('/mascotas/register', upload.single('foto'), (req, res) => {
    const { nombre, tamanio, especie, edad, genero, descripcion, idcentro } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!nombre || !tamanio || !especie || !edad || !genero || !descripcion || !idcentro) {
        return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
    }

    const sql = 'INSERT INTO mascota (nombre, tamanio, especie, edad, genero, descripcion, idcentro, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, tamanio, especie, edad, genero, descripcion, idcentro, foto], (err, result) => {
        if (err) {
            console.error('Error al registrar mascota:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Mascota registrada con éxito' });
    });
});

router.get('/mascotas', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    const idcentro = req.session.userId;
    const sql = 'SELECT * FROM mascota WHERE idcentro = ?';

    db.query(sql, [idcentro], (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas:', err);
            return res.json({ success: false, message: 'Error al obtener mascotas' });
        }
        res.json({ success: true, mascotas: results });
    });
});

router.get('/registermascota', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.redirect('/usuarios/login');
    }
    res.sendFile(path.join(__dirname, '../views/registermascota.html'));
});

router.get('/api/auth/check', (req, res) => {
    if (req.session.userId && req.session.tipo) {
        res.json({ isValid: true, tipo: req.session.tipo, userId: req.session.userId });
    } else {
        res.json({ isValid: false });
    }
});

router.get('/refugioseSolicitudes.html', (req, res) => {
    if (!req.session.userId || req.session.tipo !== 'refugio') {
        return res.redirect('/usuarios/login');
    }
    res.sendFile(path.join(__dirname, '../views', 'refugiosesolicitudes.html'));
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/rdf', (req, res) => {
  const baseURL = `${req.protocol}://${req.get('host')}`;
  const refugioSQL = 'SELECT * FROM centrosdeadopcion';

  db.query(refugioSQL, (err, refugios) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).send('Error interno');
    }

    let rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">`;

    for (let r of refugios) {
      const url = `${baseURL}/refugio/${r.idcentro}`;
      rdf += `
  <rdf:Description rdf:about="${url}">
    <tiki:nombre>${r.nombrecentro}</tiki:nombre>
    <tiki:direccion>${r.direccion}</tiki:direccion>
    <tiki:correo>${r.correo}</tiki:correo>
    <tiki:telefono>${r.telefono}</tiki:telefono>
  </rdf:Description>`;
    }

    rdf += '\n</rdf:RDF>';
    res.type('application/rdf+xml');
    res.send(rdf);
  });
});



router.get('/registerrefugio/rdf', (req, res) => {
  const baseURL = `${req.protocol}://${req.get('host')}`;

  const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">

  <rdf:Description rdf:about="${baseURL}/about">
    <tiki:descripcion>Conoce quiénes somos, nuestra misión y visión.</tiki:descripcion>
    <tiki:enlacePrincipal rdf:resource="${baseURL}"/>
  </rdf:Description>

</rdf:RDF>`;

  res.type('application/rdf+xml');
  res.send(rdf);
});




router.get('/registerrefugio/rdf', (req, res) => {
  const baseURL = `${req.protocol}://${req.get('host')}`;

  const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">

  <rdf:Description rdf:about="${baseURL}/refugios/registerrefugio">
    <tiki:descripcion>Registra un nuevo centro de adopción.</tiki:descripcion>
    <tiki:yaTengoCuenta rdf:resource="${baseURL}/usuarios/login"/>
  </rdf:Description>

</rdf:RDF>`;

  res.type('application/rdf+xml');
  res.send(rdf);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;