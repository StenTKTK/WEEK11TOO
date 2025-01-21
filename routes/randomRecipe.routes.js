const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const recipeQuery = 'SELECT id, recipeName, instructions FROM recipe ORDER BY RANDOM() LIMIT 1;';
        const recipeResult = await db.query(recipeQuery);
        const selectedRecipe = recipeResult.rows[0];
        
        const ingredientsQuery = 'SELECT b.ingredientName FROM ingredient b INNER JOIN IngredientInRecipe c ON b.id = c.ingredientId WHERE c.recipeId = $1;';

        const ingredientsResult = await db.query(ingredientsQuery, [selectedRecipe.id]);  
        const ingredients = ingredientsResult.rows.map( element => element.ingredientname);
        
        const randomRecipe = {
            recipe: selectedRecipe,
            ingredients: ingredients
        };
        res.json(randomRecipe);

    }
    catch(error) {
        console.log(error);
        res.status(500).json({errorMessage: 'Internal Server error.'});
    }
    
    
    
});

module.exports = router;