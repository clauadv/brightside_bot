import mysql from "mysql"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" });

export const database = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

// ugly way to keep the connection alive
setInterval(() => database.query("SELECT 1"), 60000);