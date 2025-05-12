import dotenv from 'dotenv';
dotenv.config(); // Carga las variables del .env

import { Client } from 'pg';

// Configuración directa con las variables de entorno
const client = new Client({
  host: process.env.DB_HOST || 'dpg-d0gs6ak9c44c73943lcg-a.oregon-postgres.render.com',
  user: process.env.DB_USER || 'tikitaw_db_user',
  password: process.env.DB_PASSWORD || 'D1Mw173Q5nJMKguEy14g1EE4qPLfrmQu',
  database: process.env.DB_NAME || 'tikitaw_db',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // Para conexiones seguras
});

// Conectar a la base de datos
client.connect()
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1); // Termina el proceso si no puede conectar
  });

export default client;
