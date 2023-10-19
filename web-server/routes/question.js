const express = require('express');
const router = express.Router();
const question_mod = require('../services/question');


/* POST Questions */
router.post('/', async function(req, res, next) {
    try {
      res.json(await question.create_question(req.body));
    } catch (err) {
      console.error(`Error while creating question`, err.message);
      next(err);
    }
  });

module.exports = router;


