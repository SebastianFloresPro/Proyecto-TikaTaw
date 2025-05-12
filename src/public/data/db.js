import { Client } from 'pg';

// Configura la conexión a PostgreSQL directamente
const client = new Client({
  host: 'dpg-d0gs6ak9c44c73943lcg-a.oregon-postgres.render.com', // Aquí va tu DB_HOST
  user: 'tikitaw_db_user', // Aquí va tu DB_USER
  password: 'D1Mw173Q5nJMKguEy14g1EE4qPLfrmQu', // Aquí va tu DB_PASSWORD
  database: 'tikitaw_db', // Aquí va tu DB_NAME
  port: 5432, // Puerto por defecto para PostgreSQL
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
