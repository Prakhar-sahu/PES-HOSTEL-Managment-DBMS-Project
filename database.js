const mysql = require('mysql2');
const dbConnection = mysql.createPool({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'root',        // MYSQL USERNAME
    password : 'prakharsahu',    // MYSQL PASSWORD
    database : 'hostel'      // MYSQL DB NAME
}).promise();
module.exports = dbConnection;