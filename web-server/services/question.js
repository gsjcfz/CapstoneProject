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

  module.exports = {
    create_question,
}