const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const recipes = await db.query('SELECT * FROM recipe;');  
    res.json(recipes.rows);
});

router.post('/', async (req, res) => {
    const {recipename} = req.body;

    const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

    console.log(data.rows);
    if(data.rows.length !== 0) {
        res.json({message: "recipe already exists"});
    } else {

        try {
            const result = await db.query("INSERT INTO recipe (recipename) VALUES ($1);", [recipename]);
            console.log(result.rowCount);
            res.status(200).json({message: `${result.rowCount} row was added.`});
        }
        catch(error) {
            console.log(error);
        }
        
    }

});

router.put('/', async (req, res) => {
    const {recipename, instructions} = req.body;
    const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

    if(data.rows.length === 0) {
        res.json({message: "there no such recipe"});
    } else {
        try {
            const result = await db.query("UPDATE recipe SET instructions = $1 WHERE recipename = $2;", [instructions, recipename]);
            res.status(200).json({message: `${result.rowCount} row was updated.`});
        }
        catch(error) {
            console.log(error);
        }
    }

});

router.delete('/', async (req, res) => {

    const {recipename} = req.body;
    const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

    if(data.rows.length === 0) {
        res.json({message: "there no such recipe"});
    } else {
        try {
            const result = await db.query("DELETE FROM recipe WHERE recipename = $1;", [recipename]);
            res.status(200).json({message: `${result.rowCount} row was deleted.`});
        }
        catch(error) {
            console.log(error);
        }
    }

});


router.post('/addingredientinrecipe', async (req, res) => {
  const { recipename, ingredientname } = req.body;

  // Normalize input values
  const normalizedRecipeName = recipename.trim().toLowerCase();
  const normalizedIngredientName = ingredientname.trim().toLowerCase();

  try {
      // Check if the recipe and ingredient pair already exists
      const data = await db.query(`
          SELECT a.recipename, b.ingredientname 
          FROM recipe a 
          INNER JOIN ingredientinrecipe c ON a.id = c.recipeid 
          INNER JOIN ingredient b ON b.id = c.ingredientid 
          WHERE LOWER(a.recipename) = $1 AND LOWER(b.ingredientname) = $2;
      `, [normalizedRecipeName, normalizedIngredientName]);

      // If the pair exists, return the message
      if (data.rows.length !== 0) {
          return res.json({ message: "Record already exists" });
      }

      // If the pair does not exist, insert it
      const result = await db.query(`
          INSERT INTO ingredientinrecipe (recipeid, ingredientid)
          SELECT a.id, b.id 
          FROM recipe a 
          JOIN ingredient b ON LOWER(b.ingredientname) = $2
          WHERE LOWER(a.recipename) = $1;
      `, [normalizedRecipeName, normalizedIngredientName]);

      console.log(result.rowCount);  // For debugging
      res.status(200).json({ message: `${result.rowCount} row was added.` });
  } catch (error) {
      console.error('Error adding ingredient to recipe:', error);
      res.status(500).json({ message: 'Error adding ingredient to recipe' });
  }
});


module.exports = router;