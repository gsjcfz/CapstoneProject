const mysql = require('mysql2/promise');
const config = require('../config');

// This will connect to and run an SQL query on the database server defined in config.js
async function query(sql, params) {
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.query(sql, params);

    connection.end();

    return results;
}

module.exports = {
    query
}