import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import registerRoutes from './src/routes/register.js';
import registerRefugiosRoutes from './src/routes/registerRefugios.js';
import loginRoutes from './src/routes/login.js'
import perfilRoutes from './src/routes/perfil.js'
import session from 'express-session';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configura middlewares para parsear cuerpos de solicitudes
app.use(express.json()); // Para JSON
app.use(express.urlencoded({ extended: true })); // Para formularios (application/x-www-form-urlencoded)

// Configura archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Configura el puerto
app.set('port', 4000);


app.use(session({
    secret: 'tu_clave_secreta', // Cambia esto por una cadena secreta
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // En producción con HTTPS debe ser true
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use((req, res, next) => {
    // Verifica si está intentando acceder al login ya autenticado
    if (req.path === '/login' && req.session.user) {
        return res.redirect('/perfil');
    }
    next();
});

// Rutas dinámicas
app.use('/register', registerRoutes);
app.use('/registerRefugios',registerRefugiosRoutes);
app.use('/login',loginRoutes);
app.use('/perfil',perfilRoutes);

// Rutas para servir páginas HTML
app.get('/', (req, res) => res.redirect('/inicio'));
app.get('/inicio', (req, res) => res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'src', 'pages', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'src', 'pages', 'register.html')));
app.get('/registerRefugios', (req, res) => res.sendFile(path.join(__dirname, 'src', 'pages', 'registerRefugios.html')));
app.get('/perfil', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.redirect(`/perfil/${req.session.user.id}`);
});

// Rutas para archivos HTML en la carpeta 'public/html'
app.get('/html/about.html', (req, res) => res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'about.html')));
app.get('/html/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'contact.html')));
app.get('/html/busqueda.html', (req, res) => res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'busqueda.html')));
app.get('/html/favoritos.html', (req, res) => res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'favoritos.html')));
app.get('/html/refugios.html', (req, res) => res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'refugios.html')));


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});



// Inicia el servidor
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en puerto', app.get('port'));
});