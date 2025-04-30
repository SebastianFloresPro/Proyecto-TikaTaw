import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Cambia esto si tu usuario de MySQL es diferente
  password: 'aliceg',   
  database: 'dbtikipaw' 
});

export default db;