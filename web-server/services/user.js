const db = require('.db');
const mycrypt = require('.crypto');
const config = require('../config');

async function createAccount(user) {
    // Salt and hash the users password
    const pass_hash = await mycrypt.generateHash(user.password);
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
    var get_user = await db.query(
        `SELECT *
        FROM APP_USER
        WHERE NAME = '${user.name}'`
    );
    if (!get_user) {
        get_user = [];
    }
    else {
        get_user = get_user[0];
    }
    // Compare the given password with the hash stored in the DB
    var result = await mycrypt.compareHash(user.password, get_user.password);
    if (!result) {
        return null;
    }
    // Generate and return an access token
    return mycrypt.generateToken(user.username);
}

module.exports = {
    createAccount,
    login
}