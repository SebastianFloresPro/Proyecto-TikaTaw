import mysql2 from 'mysql2';

const conexion = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Leeroy12@737',
    database: 'dbtikitaw',
    port: 3306,
});

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar base de datos');
        return;
    }
    console.log('Conectado a base de datos');
});

export default conexion;