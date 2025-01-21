const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const ingredients = await db.query('SELECT * FROM ingredient;');
    res.json(ingredients.rows);
});

module.exports = router;