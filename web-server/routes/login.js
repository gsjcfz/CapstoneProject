const express = require('express');
const user = require('../services/user');

const router = express.Router();

router.post('/', async function(req, res, next) {
    try {
        res.json(await user.login(req.body));
    } catch (err) {
        console.error(`Error while logging in`, err.message);
        next(err);
    }
});

module.exports = router;