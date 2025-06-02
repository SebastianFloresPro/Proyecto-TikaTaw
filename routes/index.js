const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');

router.get('/', (req, res) => {
    console.log('Accediendo a la ruta /');
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
});

router.get('/busqueda', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'busqueda.html'));
});

router.get('/favoritos', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'favoritos.html'));
});
router.get('/mascota.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'mascota.html'));
});

router.get('/busqueda/refugios', (req, res) => {
    console.log('Ruta /busqueda/refugios accedida');
    const { nombre } = req.query;
    if (!nombre) {
        console.log('Falta parámetro nombre');
        return res.json({ success: false, message: 'Debe proporcionar un nombre para buscar' });
    }

    const sql = 'SELECT * FROM centrosdeadopcion WHERE nombrecentro LIKE ?';
    const queryParam = `%${nombre}%`;
    console.log('Consulta SQL (refugios):', sql, 'con parámetro:', queryParam);
    db.query(sql, [queryParam], (err, results) => {
        if (err) {
            console.error('Error al buscar refugios:', err);
            return res.json({ success: false, message: 'Error al buscar refugios: ' + err.message });
        }
        console.log('Resultados de refugios:', results);
        res.json({ success: true, refugios: results });
    });
});

router.get('/busqueda/mascotas', (req, res) => {
    console.log('Ruta /busqueda/mascotas accedida');
    const { termino } = req.query;
    if (!termino) {
        console.log('Falta parámetro termino');
        return res.json({ success: false, message: 'Debe proporcionar un término para buscar' });
    }

    const sql = 'SELECT * FROM mascota WHERE nombre LIKE ? OR especie LIKE ?';
    const queryParams = [`%${termino}%`, `%${termino}%`];
    console.log('Consulta SQL (mascotas):', sql, 'con parámetros:', queryParams);
    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error('Error al buscar mascotas:', err);
            return res.json({ success: false, message: 'Error al buscar mascotas: ' + err.message });
        }
        console.log('Resultados de mascotas:', results);
        res.json({ success: true, mascotas: results });
    });
});
router.get('/mascotas-public', (req, res) => {
    const sql = 'SELECT * FROM mascota';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener mascotas públicas:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, mascotas: results });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/rdf', (req, res) => {
  const host = req.get('host');          
  const protocol = req.protocol;         
  const baseURL = `${protocol}://${host}`;

  const rdfXML = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">
 

  <rdf:Description rdf:about="${baseURL}/index">
    <tiki:enlaceAdoptar rdf:resource="${baseURL}/adoptar"/>
    <tiki:enlaceAbout rdf:resource="${baseURL}/about"/>
    <tiki:enlaceBuscador rdf:resource="${baseURL}/buscador"/>
    <tiki:enlaceContactarnos rdf:resource="${baseURL}/contactarnos"/>
    <tiki:enlaceLogin rdf:resource="${baseURL}/login"/>
  </rdf:Description>

</rdf:RDF>`;

  res.type('application/rdf+xml');
  res.send(rdfXML);
});

//About
router.get('/about/rdf', (req, res) => {
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


//contact 

router.get('/contact/rdf', (req, res) => {
  const baseURL = `${req.protocol}://${req.get('host')}`;

  const rdf = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:tiki="${baseURL}/rdf#">

  <rdf:Description rdf:about="${baseURL}/contact">
    <tiki:descripcion>Contáctanos para dudas, adopciones o apoyo.</tiki:descripcion>
    <tiki:enlacePrincipal rdf:resource="${baseURL}/"/>
  </rdf:Description>

</rdf:RDF>`;

  res.type('application/rdf+xml');
  res.send(rdf);
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;
