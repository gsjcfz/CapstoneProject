/*
 * config.js will contain configuration for information like the database
 * credentials and the rows we want to show per page when we paginate results
 */

const config = {
    db: {
        host                : process.env.DB_HOSTNAME,
        user                : process.env.DB_USERNAME,
        password            : process.env.DB_PASSWORD,
        database            : process.env.DB_NAME,
        connectTimeout      : 60000
    },
}

module.exports = config;