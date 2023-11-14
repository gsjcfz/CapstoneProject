const express = require('express');
const user = require('../services/user');

const router = express.Router();

router.post('/', async function(req, res, next) {
    try {
        res.json(await user.createAccount(req.body));
    } catch (err) {
        console.error(`Error while creating new user`, err.message);
        next(err);
    }
});

module.exports = router;