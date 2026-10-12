
require("dotenv").config();

const { Pool } = require("pg");

const db = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = db;
