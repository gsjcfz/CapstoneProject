const express = require('express');
const router = express.Router();
const example_mod = require('../services/example');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await example_mod.example_service());
  } catch (err) {
    console.error(`Error with example! `, err.message);
    next(err);
  }
});

module.exports = router;