const db = require('./db');

async function user_exists(username) {
    const sql_query = `SELECT 1 FROM \`USER\` WHERE \`name\`='${username}';`;
    const row = await db.query(sql_query);
    if (row[0]) {return true;}
    else {return false;}
}

async function pack_exists(pack_id) {
    const sql_query = `SELECT 1 FROM \`PACK\` WHERE \`ID\`=${pack_id};`;
    const row = await db.query(sql_query);
    if (row[0]) {return true;}
    else {return false;}
}

async function getPackLeaderboard(pack_id) {
    // This makes constructing `query` easier    
    const sql_query = `
SELECT \`username\`, \`pack_score\`
FROM \`USER_SCORE\`
WHERE \`pack_ID\`=${pack_id}
ORDER BY \`pack_score\` DESC
LIMIT 10;
`   ;
    const rows = await db.query(sql_query);
    let result = {
        pack: pack_id,
        scores: rows
    };
    return result;
}

async function getPlayerScore(pack_id, username) {
    const sql_query = `
SELECT \`pack_score\`
FROM \`USER_SCORE\`
WHERE \`pack_ID\`=${pack_id}
AND \`username\`='${username}'
LIMIT 1;
`   ;
    const rows = await db.query(sql_query);
    let result = {
        username: username,
        pack_ID: pack_id,
        score: -1,
    };
    if (rows[0]) {
        result.score = rows[0].pack_score;
    }
    return result;
}

async function setPlayerScore(pack_id, username, score) {
    const sql_query = `
INSERT INTO \`USER_SCORE\` (\`pack_ID\`, \`username\`, \`pack_score\`)
VALUES (${pack_id}, '${username}', ${score})
ON DUPLICATE KEY UPDATE \`pack_score\`=${score};
`   ;
    let result = {
        username: username,
        pack_ID: pack_id,
        score: -1,
    };
    if (
        await user_exists(username) &&
        await pack_exists(pack_id)
    ) {
        const rows = await db.query(sql_query);
        if (rows[0]) {
            result.score = rows[0].pack_score;
        }
    } else {
        result.error = "foreign_key_constraint";
    }
    return result;
}

module.exports = {
    getPackLeaderboard,
    getPlayerScore,
    setPlayerScore,
}