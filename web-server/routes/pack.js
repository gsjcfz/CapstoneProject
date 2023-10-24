const express = require('express');
const router = express.Router();
const pack = require('../services/pack')

/* GET list of packs with creator info */
router.get('/', async function(req, res, next) {
  try {
    res.json(await pack.listPacks());
  } catch (err) {
    console.error(`Error while getting packs: `, err.message);
    next(err);
  }
});

module.exports = router;