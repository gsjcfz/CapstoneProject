const db = require('./db');
const helper = require('../helper');
const config = require('../config');

/* GET list of packs with creator info */
async function listPacks(){
  const rows = await db.query(
    `SELECT \`PACK\`.*, \`USER\`.\`name\`
    FROM \`PACK\` INNER JOIN \`USER\` 
      ON \`PACK\`.\`user_ID\` = \`USER\`.\`ID\`;`
  );
  const data = helper.getTuples(rows);

  return {
    data
  }
}

module.exports = {
  listPacks
}