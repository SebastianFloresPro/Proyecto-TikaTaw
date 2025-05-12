import dotenv from 'dotenv';
dotenv.config(); // Carga las variables del archivo .env

import { Client } from 'pg'; // Usamos 'pg' para PostgreSQL

// Verifica que las variables se estén leyendo correctamente
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Crea la conexión a la base de datos utilizando las variables de entorno
const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Desactiva la verificación de certificados SSL (útil para entornos como Render)
    },
});

client.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

export default client;
