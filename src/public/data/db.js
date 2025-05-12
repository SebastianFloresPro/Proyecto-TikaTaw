import dotenv from 'dotenv';
dotenv.config(); // Carga las variables del .env

import { Client } from 'pg';

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });

export default client;