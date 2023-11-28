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

async function create_questions(data) {
  console.log(data);
  // We delete all questions within the specified pack before adding back the new ones.
  const pack_ID = data.question_data[0].pack_ID;
  let final_query = `DELETE FROM \`QUESTION\` WHERE \`QUESTION\`.\`pack_ID\` = ${pack_ID};`;
  const qid_var = "@qid";
  const pid_var = "@pid";
  for (let i = 0; i < data.question_data.length; i++) {
    final_query = final_query.concat(`\nINSERT INTO \`QUESTION\` (\`type\`, \`point_value\`, \`pack_ID\`) VALUES`);
    current_q = data.question_data[i];

    // Add the question to the final query
    final_query = final_query.concat(`\n("${current_q.type}", ${current_q.point_value}, ${current_q.pack_ID});`);
    // Set the variable for the question ID
    final_query = final_query.concat(`\nSET ${qid_var} := LAST_INSERT_ID();`);

    for (let j = 0; j < current_q.prompt.length; j++) {
      final_query = final_query.concat(`\nINSERT INTO \`PROMPT\` (\`text\`, \`question_ID\`) VALUES`);
      current_p = current_q.prompt[j];

      // Add the prompt to the final query
      final_query = final_query.concat(`\n("${current_p.text}", ${qid_var});`);
      // Set the variable for the prompt ID
      final_query = final_query.concat(`\nSET ${pid_var} = LAST_INSERT_ID();`)

      let a_query = `\nINSERT INTO \`ANSWER\` (\`text\`, \`correct\`, \`prompt_ID\`) VALUES`;
      for (let k = 0; k < current_p.answer.length; k++) {
        current_a = current_p.answer[k];

        // Add the answer to the answer query
        a_query = a_query.concat(`\n("${current_a.text}", ${current_a.correct}, ${pid_var}),`);
      }
      // Get rid of trailing commas and combine a_query into final query
      a_query = a_query.replace(/.$/,";");
      final_query = final_query.concat(a_query);
    }
  }

  // Send out the query
  const result = await db.query(final_query);

  let message = 'Error in creating questions';
  
  if (result.length > 0) {
    message = 'Questions created successfully';
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
async function get_all_questions(PACKID){
  let data = [];
  data = await db.query(
    `SELECT \`Q\`.\`ID\` AS \`QID\`,\`Q\`.\`type\`, \`Q\`.\`level\`, \`Q\`.\`point_value\`, \`Q\`.\`image\` AS \`Qimage\`, \`Q\`.\`pack_ID\`,
    \`P\`.\`ID\` AS \`PID\`, \`P\`.\`text\` AS \`Ptext\`, \`P\`.\`image\` AS \`Pimage\`, \`P\`.\`question_ID\`,
    \`A\`.\`ID\` AS \`AID\`, \`A\`.\`text\` AS \`Atext\`, \`A\`.\`correct\`, \`A\`.\`image\` AS \`Aimage\`, \`A\`.\`prompt_ID\`
    FROM \`QUESTION\` AS \`Q\` INNER JOIN \`PROMPT\` AS \`P\`
        ON \`P\`.\`question_ID\` = \`Q\`.\`ID\`
      INNER JOIN \`ANSWER\` AS \`A\`
        ON \`A\`.\`prompt_ID\` = \`P\`.\`ID\`
    WHERE \`Q\`.\`pack_ID\` = ${PACKID}
    ORDER BY \`LEVEL\`, \`Q\`.\`ID\`, \`P\`.\`ID\`, \`A\`.\`ID\`;`
  );

  // ordered loop is question.prompt.answer
  let ordered_data = []
  if (data.length === 0) {
    return ordered_data;
  }

  let current_q = {};
  let current_p = {};
  let current_a = {};
  // iterate over data
  for (let i = 0; i < data.length; i++) {
    console.log(i, current_q, current_p);

    // if theres a current question but it doesnt match incoming tuple
    //  then push current_q to ordered_data and clear current_q
    if (Object.keys(current_q).length != 0) {
      if (current_q.ID != data[i].QID) {
        current_q.prompt.push(current_p);
        ordered_data.push(current_q);
        current_q = {};
        current_p = {};
      }
    }
    // if theres no current question
    //  then fill current_q with incoming tuple
    if (Object.keys(current_q).length === 0) {
      current_q = {
        ID: data[i].QID,
        type: data[i].type,
        level: data[i].level,
        point_value: data[i].point_value,
        image: data[i].Qimage,
        pack_ID: data[i].pack_ID,
        prompt: []
      }
    }
    // there is a current question and it matches the incoming tuple

    // if theres a current prompt but it doesnt match the incoming tuple
    //  then push current_p to current_q.prompts and clear current_p
    if (Object.keys(current_p).length != 0) {
      if (current_p.ID != data[i].PID) {
        current_q.prompt.push(current_p);
        current_p = {};
      }
    }
    // if theres no current prompt,
    //  then fill current_p with incoming tuple
    if (Object.keys(current_p).length === 0) {
      current_p = {
        ID: data[i].PID,
        text: data[i].Ptext,
        image: data[i].Pimage,
        question_ID: data[i].question_ID,
        answer: []
      }
    }
    // theres a prompt and it matches the incoming tuple

    // always fill, push, and clear current_a
    current_a = {
      ID: data[i].AID,
      text: data[i].Atext,
      correct: data[i].correct,
      image: data[i].Aimage,
      prompt_ID: data[i].prompt_ID
    }
    current_p.answer.push(current_a);
    current_a = {};
  }

  current_q.prompt.push(current_p);
  ordered_data.push(current_q);

  if (!ordered_data){
    ordered_data = [];
  }

  console.log(ordered_data);
  return ordered_data;
}


  module.exports = {
    create_question,
    create_questions,
    get_question,
    get_all_questions
  }

//Get Question
//Get All Question in pack?