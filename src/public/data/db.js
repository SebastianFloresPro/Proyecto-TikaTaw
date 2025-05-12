import dotenv from 'dotenv';
dotenv.config(); // Carga las variables del .env

import { Client } from 'pg';

// Configura la conexión a PostgreSQL usando las variables de entorno correctamente
const client = new Client({
  host: process.env.DB_HOST || 'dpg-d0gs6ak9c44c73943lcg-a.oregon-postgres.render.com', // Reemplaza el valor por tu DB_HOST real si no está en el .env
  user: process.env.DB_USER || 'tikitaw_db_user',
  password: process.env.DB_PASSWORD || 'D1Mw173Q5nJMKguEy14g1EE4qPLfrmQu',
  database: process.env.DB_NAME || 'tikitaw_db',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }, // Para conexiones seguras en Render
});

// Conecta al cliente de PostgreSQL
client.connect()
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1); // Termina el proceso si no puede conectar
  });

export default client;
