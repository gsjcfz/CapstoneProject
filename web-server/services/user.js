const db = require('./db');
const mycrypt = require('./crypto');
const config = require('../config');

async function createAccount(user) {
    // Salt and hash the users password
    const pass_hash = await mycrypt.generateHash(user.password);
    // Insert the new user into the database (with the hashed password)
    const result = await db.query(
        `INSERT INTO \`USER\` (\`name\`, \`password\`, \`professor\`)
        VALUES ("${user.name}", "${pass_hash}", ${user.professor})`
    );
    let response = {
        success : false
    };
    if (result.affectedRows) {
        response.success = true;
    }

    return response;
}

async function login(user) {
    // See if the user with the username is in the database
    var get_user = await db.query(
        `SELECT *
        FROM \`USER\`
        WHERE \`name\` = '${user.name}'`
    );

    let response = {
        success : false,
        message : "Username or password is incorrect",
        token   : null,
        instructor  : false
    };

    if (get_user[0] === undefined) {
        return response;
    }
    get_user = get_user[0];

    // Compare the given password with the hash stored in the DB
    var result = await mycrypt.compareHash(user.password, get_user.password);
    if (!result) {
        return response;
    }
    // Generate and return an access token
    response.success = true
    response.message = "Login successful"
    response.token = mycrypt.generateToken(user.name);
    response.instructor = Boolean(get_user.professor);
    return response;
}

module.exports = {
    createAccount,
    login
}