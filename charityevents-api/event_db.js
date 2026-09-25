require('dotenv').config();
const mysql = require('mysql2');

const connectionPool = mysql.createPool({
    database: process.env.DB_NAME || 'charityevents_db',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

const dbPool = connectionPool.promise();

module.exports = dbPool;
