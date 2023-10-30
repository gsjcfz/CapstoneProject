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

/* POST a new pack */
router.post('/', async function(req, res, next) {
  try {
    res.json(await pack.createPack(req.body));
  } catch (err) {
    console.error(`Error while creating pack`, err.message);
    next(err);
  }
});

/* DELETE a pack */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await pack.removePack(req.params.id));
  } catch (err) {
    console.error(`Error while deleting pack`, err.message);
    next(err);
  }
});

module.exports = router;