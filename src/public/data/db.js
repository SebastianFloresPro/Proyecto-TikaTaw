import { Client } from 'pg';

// Configura la conexión directamente en el código
const client = new Client({
  host: 'dpg-d0gs6ak9c44c73943lcg-a.oregon-postgres.render.com', // El host de tu base de datos en Render
  user: 'tikitaw_db_user',  // Usuario de tu base de datos
  password: 'D1Mw173Q5nJMKguEy14g1EE4qPLfrmQu', // La contraseña de tu base de datos
  database: 'tikitaw_db',  // El nombre de tu base de datos
  port: 5432,  // Puerto predeterminado de PostgreSQL
  ssl: { rejectUnauthorized: false }, // Requiere esto para Render
});

// Conecta al cliente de PostgreSQL
client.connect()
  .then(() => console.log('✅ PostgreSQL conectado'))
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1); // Termina el proceso si no puede conectar
  });

export default client;
