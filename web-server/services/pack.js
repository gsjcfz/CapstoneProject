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

/* POST a new pack */
async function createPack(pack){
  const result = await db.query(
    `INSERT INTO \`PACK\`
    (\`name\`, \`user_ID\`) 
    VALUES 
    ('${pack.name}', ${pack.user_ID})`
  );

  let message = 'Error in creating pack';

  if (result.affectedRows) {
    message = 'Pack created successfully';
  }

  return {message};
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
  createPack,
  removePack
}