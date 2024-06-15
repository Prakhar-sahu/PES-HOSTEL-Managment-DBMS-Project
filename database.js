require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

// Create a connection pool with environment variables
const dbConnection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// Export the connection pool
module.exports = dbConnection;
