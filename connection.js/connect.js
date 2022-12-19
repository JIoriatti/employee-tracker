const mysql = require('mysql2');


require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    // port: 3001,
    user: 'root',
    password: process.env.PASSWORD,
    database: 'company_db'
});

module.exports = db;