const express = require('express');
const router = express.Router();

const db = require('../data/db.js');

router.get('/', (req, res) => {
    res.status(200).json({ message: "routes working" });
})

module.exports = router;