import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

// Rutas dinámicas
import registerRoutes from './src/routes/register.js';
import registerRefugiosRoutes from './src/routes/registerRefugios.js';
import loginRoutes from './src/routes/login.js';
import perfilRoutes from './src/routes/perfil.js';
import favoritoRoutes from './src/routes/favoritos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// --- Middlewares ---

// Parseo de body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Sesiones
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  }
}));

// Redirección si ya está logueado
app.use((req, res, next) => {
  if (req.path === '/login' && req.session.user) {
    return res.redirect('/perfil');
  }
  next();
});

// --- Rutas dinámicas ---
app.use('/register', registerRoutes);
app.use('/registerRefugios', registerRefugiosRoutes);
app.use('/login', loginRoutes);
app.use('/perfil', perfilRoutes);
app.use('/', favoritoRoutes); // IMPORTANTE: debe ir después del middleware de sesión

// --- Rutas para páginas HTML (vistas) ---
// Paginas de la carpeta 'pages'
app.get('/', (req, res) => res.redirect('/inicio'));
app.get('/inicio', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'))
);
app.get('/login', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'pages', 'login.html'))
);
app.get('/register', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'pages', 'register.html'))
);
app.get('/registerRefugios', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'pages', 'registerRefugios.html'))
);

// Vista de favoritos (la que te fallaba)
app.get('/favoritos', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'favoritos.html'))
);

// Redirección a perfil por ID
app.get('/perfil', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect(`/perfil/${req.session.user.id}`);
});

// Archivos HTML en 'public/html'
app.get('/html/about.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'about.html'))
);
app.get('/html/contact.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'contact.html'))
);
app.get('/html/busqueda.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'busqueda.html'))
);
app.get('/html/refugios.html', (req, res) =>
  res.sendFile(path.join(__dirname, 'src', 'public', 'html', 'refugios.html'))
);

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
