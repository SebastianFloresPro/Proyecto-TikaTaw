import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//server
const app = express();
app.set("port",4000);
app.listen(app.get("port"))
console.log("Servidor corriendo en puerto", app.get("port"))

//configuracion
app.use(express.static(__dirname + "/public"))

//rutas
app.get("/inicio",(req,res)=> res.sendFile(__dirname+"/pages/inicio.html"))
app.get("/login",(req,res)=> res.sendFile(__dirname+"/pages/login.html"))
app.get("/register",(req,res)=> res.sendFile(__dirname+"/pages/register.html"))
app.get("/registerrefugio",(req,res)=> res.sendFile(__dirname+"/pages/registerrefugio.html"))
