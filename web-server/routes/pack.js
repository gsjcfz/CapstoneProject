const express = require('express');
const router = express.Router();
const pack = require('../services/pack')
const std_err = require('../helper').std_err;

/* GET list of packs with creator info */
router.get('/', async function(req, res, next) {
  try {
    res.json(await pack.listPacks());
  } catch (err) {
    console.error(`Error while getting packs: `, err.message);
    next(err);
  }
});

/* GET list of packs with creator info */
router.get('/user', async function(req, res, next) {
  try {
    res.json(await pack.listPacksScores(req.auth_username));
  } catch (err) {
    console.error(`Error while getting packs: `, err.message);
    next(err);
  }
});

/* POST a new pack */
router.post('/', async function(req, res, next) {
  const pack_name = req.body.name;
  if (pack_name === undefined) {
    res.status(400).json(std_err(400, err="Missing Pack Name"));
  }
  try {
    res.json(await pack.createPack(pack_name, req.auth_username));
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