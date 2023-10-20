const db = require('.db');
const hashing = require('.hashing');
const helper = require('../helper');
const config = require('../config');

async function createAccount(user) {
    // Salt and hash the users password
    const pass_hash = await hashing.generateHash(user.password);
    // Insert the new user into the database (with the hashed password)
    const result = await db.query(
        `INSERT INTO APP_USER (name, password, professor)
        VALUES (${user.name}, ${pass_hash}, ${user.professor})`
    );
    // If there are no affected rows, we return an error message
    let message = 'Error in adding new user'
    if (result.affectedRows) {
        message = 'New user created successfully'
    }

    return {message};
}

async function login(user) {
    // See if the user with the username is in the database
    const get_user = await db.query(
        `SELECT *
        FROM APP_USER
        WHERE NAME = '${user.name}'`
    );
    if (!get_user) {
        get_user = [];
    }

}