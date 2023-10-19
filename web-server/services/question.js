const helper = require('../helper');
const config = require('../config');
const db = require('./db')

//CHECK ^^^^  Down should work?
async function create_question(question){
    const result = await db.query(
      `INSERT INTO questions 
      (question_ID, question_type, level, image_ID, pack_ID) 
      VALUES 
      ('${question.question_ID}', ${question.question_type}, ${question.level}, ${question.image_ID}, ${question.pack_ID})`
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