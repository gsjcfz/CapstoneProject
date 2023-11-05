const helper = require('../helper');
const config = require('../config');
const db = require('./db')

//CHECK ^^^^  Down should work?
async function create_question(QUESTION){
    const result = await db.query(
      `INSERT INTO QUESTION 
      (type, level, point_value, image_ID, pack_ID) 
      VALUES 
      (${QUESTION.type}, ${QUESTION.level}, ${QUESTION.point_value}, ${QUESTION.image_ID}, ${QUESTION.pack_ID})`
    );
  
    let message = 'Error in creating questions';
  
    if (result.affectedRows) {
      message = 'Question created successfully';
    }
  
    return {message};
  }
//Get Question
async function get_question(QUESTION){
  const result = await db.query(
    `SELECT *
    FROM \`QUESTION\`
    WHERE \`QUESTION_ID\` = ${QUESTION.ID}
    AND  \`QUESTION_PACK_ID\` = ${QUESTION.PACK_ID}`
  );
  if (!result){
    result = [];
  }
  return result;

  }
//Get All Questions from a PACK
async function get_all_questions(PACK){
  const result = await db.query(
    `SELECT *
    FROM \`QUESTIONS\`
    WHERE \`QUESTION_PACK_ID\` = ${PACK.ID}`
  );
  if (!result){
    result = [];
  }
  return result
  }

  module.exports = {
    create_question,
    get_question,
    get_all_questions
  }

//Get Question
//Get All Question in pack?