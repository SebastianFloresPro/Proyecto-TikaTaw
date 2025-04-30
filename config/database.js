import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Aquí va tu usuario de MySQL
  password: 'Leeroy12@737',   // Aquí va tu contraseña de MySQL
  database: 'tikitaw_db'  // El nombre de tu base de datos
});

export default db;