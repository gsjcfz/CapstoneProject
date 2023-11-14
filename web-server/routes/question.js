const express = require('express');
const router = express.Router();
const question_mod = require('../services/question');


/* POST Questions */
router.post('/', async function(req, res, next) {
    try {
      res.json(await question_mod.create_question(req.body));
    } catch (err) {
      console.error(`Error while creating question`, err.message);
      next(err);
    }
  });

  router.get('/', async function(req, res, next) {
    try {
      res.json(await question_mod.get_question(req.query.pack, req.query.question));
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
  });

  router.get('/all', async function(req, res, next) {
    try {
      res.json(await question_mod.get_all_questions(req.query.pack));
    } catch (err) {
      console.error(`Error while getting programming languages `, err.message);
      next(err);
    }
  });

module.exports = router;


