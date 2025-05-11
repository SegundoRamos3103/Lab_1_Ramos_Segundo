const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER || 'root', // Fallback por si no carga .env
    password: process.env.DB_PASSWORD || '', // Fallback
    database: process.env.DB_NAME || 'tienda_virtual',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();