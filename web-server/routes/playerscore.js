const express = require('express');
const router = express.Router();
const scores_mod = require('../services/scores');
const std_err = require('../helper').std_err;

router.get('/', async function(req, res, next) {
    try {
        const pack_id = Number(req.query.pack);
        const user_id = Number(req.query.user);
        if (pack_id === NaN || pack_id < 0) {
            res.status(400).json(std_err(400, err="Invalid Pack ID: missing, NaN or <0"));
        } else if (user_id === NaN || user_id < 0) {
            res.status(400).json(std_err(400, err="Invalid User ID: missing, NaN or <0"));
        } else {
            const data = await scores_mod
            .getPlayerScore(pack_id, user_id);
            res.json(data);
        }
    } catch (err) {
        console.error(`Error with player score fetch`, err.message);
        res.status(500).json(std_err(500));
    }
});

router.put('/', async function (req, res, next) {
    try {
        const authorized = true; //TODO: actual player authorization
        if (authorized) {
            const pack_id = Number(req.query.pack);
            const user_id = Number(req.query.user);
            const score = Number(req.query.score);
            if (pack_id == NaN || pack_id < 0) {
                res.status(400).json(std_err(400, err="Invalid Pack ID: missing, NaN or <0"));
            } else if (user_id == NaN || user_id < 0) {
                res.status(400).json(std_err(400, err="Invalid User ID: missing, NaN or <0"));
            } else if (score == NaN || score < 0) {
                res.status(400).json(std_err(400, err="Invalid Score: missing, NaN or <0"));
            } else {
                const data = await scores_mod
                    .setPlayerScore(pack_id, user_id, score);
                if (data.error == "foreign_key_constraint") {
                    res.status(409).json(std_err("nonexistent",
                        err="User or pack does not exist"
                    ));
                } else {
                    res.status(201).json(data);
                }
            }
        } else {
            res.status(403).json(std_err(403,
                err="You are not authorized to change this user's score"
            ));
        }
    } catch (err) {
        console.error(`Error with player score insertion`, err.message);
        res.status(500).json(std_err(500));
    }
});

module.exports = router;