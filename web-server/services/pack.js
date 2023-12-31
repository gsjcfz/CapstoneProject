const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/* GET list of packs with creator info */
async function listPacks(){
  const rows = await db.query(
    `SELECT \`PACK\`.*
    FROM \`PACK\` INNER JOIN \`USER\` 
      ON \`PACK\`.\`username\` = \`USER\`.\`name\`;`
  );
  const data = helper.getTuples(rows);

  return {
    data
  }
}

/* GET list of packs with user score */
async function listPacksScores(username){
  const rows = await db.query(
    `SELECT T.\`ID\`, T.\`name\`, T.\`points_total\`, U.\`pack_score\`, T.\`instructor\`, T.\`question_count\`
    FROM (
        (SELECT P.\`ID\`, P.\`name\`, P.\`username\` AS \`instructor\`, SUM(Q.point_value) AS \`points_total\`, COUNT(Q.point_value) AS \`question_count\`
          FROM \`PACK\` P
              JOIN \`QUESTION\` Q
              ON P.\`ID\`=Q.\`pack_ID\`
          GROUP BY P.\`ID\`, P.\`name\`
          ) T
      LEFT JOIN (
          SELECT *
          FROM \`USER_SCORE\` C
          WHERE C.\`username\`="${username}") U
      ON T.\`ID\` = U.\`pack_ID\`)
    `
  );
  const data = helper.getTuples(rows);
  return {
    data
  }
}

/* POST a new pack */
async function createPack(name, username){
  const result = await db.query(
    `INSERT INTO \`PACK\`
    (\`name\`, \`username\`) 
    VALUES 
    ('${name}', '${username}')`
  );

  let pack_ID = -1;

  if (result.affectedRows) {
    pack_ID = result.insertId;
  }

  return {pack_ID};
}

/* DELETE a pack */
async function removePack(id){
  const result = await db.query(
    `DELETE FROM \`PACK\` WHERE \`ID\` = ${id}`
  );

  let message = 'Error in deleting pack';

  if (result.affectedRows) {
    message = 'Pack deleted successfully';
  }

  return {message};
}


module.exports = {
  listPacks,
  listPacksScores,
  createPack,
  removePack
}