import express from "express";
import path from 'path';
import usuariosRouter from './routes/usuarios.js'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//server
const app = express();
app.set("port",4000);


// Middleware para poder leer datos JSON
app.use(express.json()); // Esta línea es esencial para que express pueda interpretar el cuerpo de las solicitudes JSON
app.use(usuariosRouter);

app.listen(app.get("port"))
console.log("Servidor corriendo en puerto", app.get("port"))

//configuracion
app.use(express.static(__dirname + "/public"))

//rutas
app.get("/inicio",(req,res)=> res.sendFile(__dirname+"/pages/inicio.html"))
app.get("/login",(req,res)=> res.sendFile(__dirname+"/pages/login.html"))
app.get("/register",(req,res)=> res.sendFile(__dirname+"/pages/register.html"))
app.get("/registerrefugio",(req,res)=> res.sendFile(__dirname+"/pages/registerrefugio.html"))
app.get("/about",(req,res)=> res.sendFile(__dirname+"/pages/about.html"))
app.get("/contact",(req,res)=> res.sendFile(__dirname+"/pages/contact.html"))

// Ruta POST para /register//NO SIRVE XD
app.post("/register", (req, res) => {
    const { nombre, correo, contraseña } = req.body;
  
    // Validaciones simples
    if (!nombre || !correo || !contraseña) {
      return res.status(400).send("Por favor llena todos los campos.");
    }
  
    if (!correo.includes("@") || !correo.includes(".")) {
      return res.status(400).send("Correo no válido.");
    }
  
    // Guardar el usuario (simulación)
    console.log("Usuario registrado:", { nombre, correo, contraseña });
  
    // Si todo es correcto, responder con éxito
    res.status(200).json({ message: "¡Usuario registrado con éxito!" });
  });