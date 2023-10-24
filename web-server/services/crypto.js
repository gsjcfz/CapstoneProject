const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

async function generateHash(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

async function compareHash(password, hash) {
    bcrypt.compare(password, hash, function(err, match) {
        if (err) { throw err; }
        return match;
    });
}

function generateToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET);
}

// some middleware
function authenticateToken(req, res, next) {
    // parse the token out of the req
    const authHeader = req.headers['authorization'];
    // Handle a bad request (one without an authorization header)
    if (!(authHeader)) {
        res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];

    // using jwt and the token secret, verify the token
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, username) {
        // if we got thrown an error verifying the token, the token is invalid and we throw a 403 error
        if (err) {
            console.log(err);
            res.sendStatus(403);
        }
        // otherwise, set the username value in the request and move on
        req.username = username;
        next()
    });
}

module.exports = {
    generateHash,
    compareHash,
    generateToken,
    authenticateToken
}