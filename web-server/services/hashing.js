const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHash(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

async function compareHash(password, hash) {
    return bcrypt.compare(password, hash)
}