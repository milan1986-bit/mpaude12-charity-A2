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

connectionPool.getConnection((connectionError, connection) => {
    if (connectionError) {
        console.error('charityevents_db connection failed:', connectionError.message);
        return;
    }
    console.log('charityevents_db is connected and ready.');
    connection.release();
});

module.exports = dbPool;
