const express = require('express');
const router = express.Router();
const scores_mod = require('../services/scores');
const { std_err } = require('../helper');

router.get('/', async function(req, res, next) {
    try {
        const pack_id = Number(req.query.pack);
        if (pack_id === NaN || pack_id < 0) {
            res.json(std_err(400, err="Invalid Pack ID: missing, NaN or <0"));
        } else {
            const data = await scores_mod
                .getPackLeaderboard(pack_id);
            res.json(data);
        }
    } catch (err) {
        console.error(`Error with leaderboard fetch`, err.message);
        res.status(500).json(std_err(500));
    }
});

module.exports = router;