// index.js
import express from "express";
import path from 'path';
import usuariosRouter from './routes/usuarios.js'; // Ruta de usuarios
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server
const app = express();
app.set("port", 4000);

// Middleware para poder leer datos JSON
app.use(express.json());
app.use(usuariosRouter); // Usar las rutas de usuarios

app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});

// configuración
app.use(express.static(__dirname + "/public"));

// rutas para las páginas
app.get("/inicio", (req, res) => res.sendFile(__dirname + "/pages/inicio.html"));
app.get("/login", (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/registerrefugio", (req, res) => res.sendFile(__dirname + "/pages/registerrefugio.html"));
