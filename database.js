const mysql = require('mysql2');
const dbConnection = mysql.createPool({
    connectionLimit: 10,
    host     : 'mysql-13a1650e-jsahu2814-a152.j.aivencloud.com', // MYSQL HOST NAME
    port: 16189,
    user     : 'avnadmin',        // MYSQL USERNAME
    password : 'AVNS_0iYIT3O5oR4P3_W9f_R',    // MYSQL PASSWORD
    database : 'hostel'      // MYSQL DB NAME
}).promise();
module.exports = dbConnection;
