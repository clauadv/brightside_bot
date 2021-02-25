const mysql = require("mysql");
const dotenv = require("dotenv").config({ path: "./.env" })

const connect = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

// ghetto way of keeping the connection alive
setInterval(function () {
    connect.query('SELECT 1');
}, 60000);

module.exports = connect;