const helper = require('../helper');
const config = require('../config');

async function example_service() {
    return helper.example_helper() + " " + config.example;
}

module.exports = {
    example_service,
}