const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");

const itemsPool = new Pool ({
    connectionString: process.env.DBConnectionString,
    ssl: {
        rejectUnauthorized: false
    }
});





// const itemsPool = new Pool({
//     user: 'postgres',
//     password: 'Stennnuu33',
//     host: 'localhost',
//     port: 5432,
//     database: 'myrecipes'
// });

module.exports = itemsPool;