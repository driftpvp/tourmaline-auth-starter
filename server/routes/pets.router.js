const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// This route *should* return the logged in users pets
router.get('/', (req, res) => {
    console.log('/pet GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    if(req.isAuthenticated()) {
        let queryText = `SELECT * FROM "pets" WHERE "user_id" = $1;`;
        pool.query(queryText, [req.user.id]).then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(401);
    }
});

// This route *should* add a pet for the logged in user
router.post('/', (req, res) => {
    console.log('/pet POST route');
    console.log(req.body);
    // req.isAthenticated() is a function provided by 
    // password, it returns true/false
    console.log('is authenticated?', req.isAuthenticated());
    if(req.isAuthenticated()) {
        console.log('user', req.user);
        //Add pet to db
        let queryText = `INSERT INTO "pets" ("name", "user_id") 
                        VALUES ($1, $2);`;
                                                //! req.user.id is the currently logged in users id
        pool.query(queryText, [req.body.name, req.user.id])
        .then(result => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500);
        })
    }else {
        res.sendStatus(401);
    }
    
    
    
});

module.exports = router;