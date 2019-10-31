var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'arisoft.2019',
    database: 'invmobiledb'
});

module.exports = connection;