/*
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el nombre del archivo y la ruta del directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una instancia de Express
const app = express();

// Establecer el puerto
app.set("port", 4000);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Definir las rutas para tus páginas
app.get("/inicio", (req, res) => res.sendFile(path.join(__dirname, "pages", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "pages", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "pages", "register.html")));
app.get("/registerrefugio", (req, res) => res.sendFile(path.join(__dirname, "pages", "registerrefugio.html")));

// Iniciar el servidor
app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});
*/


/*

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usuariosRouter from './routes/usuarios.js';
import loginRouter from './routes/login.js';
import centrosRouter from './routes/centros.js';

// Obtener el nombre del archivo y la ruta del directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una instancia de Express
const app = express();

// Establecer el puerto
app.set('port', 4000);

// Middleware para parsear formularios y JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas
app.use('/api', usuariosRouter);
app.use('/api', loginRouter);
app.use('/api', centrosRouter);

// Ruta raíz para redirigir a /inicio
app.get('/', (req, res) => res.redirect('/inicio'));

// Rutas para páginas principales
app.get('/inicio', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'register.html')));
app.get('/registerrefugio', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'registerrefugio.html')));

// Rutas para páginas estáticas en public/html/
app.get('/html/about.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'about.html')));
app.get('/html/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'contact.html')));
app.get('/html/busqueda.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'busqueda.html')));
app.get('/html/favoritos.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'favoritos.html')));
app.get('/html/refugios.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'refugios.html')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en puerto', app.get('port'));
});

*/
/*
import express from 'express';
import db from '../config/database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  // Validación básica
  if (!correo || !password) {
    return res.status(400).json({ message: "Por favor llena todos los campos." });
  }

  try {
    // Buscar usuario por correo
    const [rows] = await db.execute('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    // Verificar contraseña
    const match = await bcrypt.compare(password, user.clave);
    if (!match) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }

    return res.status(200).json({ message: "¡Inicio de sesión exitoso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocurrió un error al iniciar sesión." });
  }
});

export default router;
*/
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usuariosRouter from './routes/usuarios.js';
import loginRouter from './routes/login.js';
import centrosRouter from './routes/centros.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('port', 4000);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', usuariosRouter);
app.use('/api', loginRouter);
app.use('/api', centrosRouter);

app.get('/', (req, res) => res.redirect('/inicio'));
app.get('/inicio', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'register.html')));
app.get('/registerrefugio', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'registerrefugio.html')));

app.get('/html/about.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'about.html')));
app.get('/html/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'contact.html')));
app.get('/html/busqueda.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'busqueda.html')));
app.get('/html/favoritos.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'favoritos.html')));
app.get('/html/refugios.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'refugios.html')));

app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en puerto', app.get('port'));
});