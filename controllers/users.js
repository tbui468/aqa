const db = require('./../db/index');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.user_index = async function(req, res, next) {
    try{
        let result = await db.query('SELECT * FROM users ORDER BY user_id ASC;', []);
        return res.status(200).json(result.rows);
    }catch(err){
        return next(err);
    }
}

//what json should this return???
exports.user_new = function(req, res, next) {
    return res.json({ message: 'user_new says hi!' });
}

exports.user_create = [

    body('username', 'Name must be specified').trim().isLength({ min: 1, max: 30}).escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1, max: 30 }).escape(),
    body('password', 'Password must specified').trim().isLength({ min: 5, max: 30 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.json({ message: 'yo fucked up son' }); //how should these types of errors be handled?
        }else{
            bcrypt.hash(req.body.password, 10, (err, hashedpw) => {
                if(err) { return next(err); }
                let promise = db.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3);', [req.body.username, req.body.email, hashedpw]);
                promise.then(function(result) {
                    return res.json({ message: 'new user created in database' });
                }).catch(function(err) {
                    return next(err);
                });
            });
        }
    }
]

exports.user_show = async function(req, res, next) {
    try{
        const result = await db.query('SELECT * FROM users WHERE user_id=$1;', [req.params.id]);
        const weightsResult = await user_compute_weights(req.params.id);
        const obj = {
            weights: weightsResult,
            user: result.rows[0]
        };
        return res.status(200).json(obj);
    }catch(err){
        return next(err);
    }
}

//return json of current information to populate view (not weight or password)
exports.user_edit = function(req, res, next) {
    let promise = db.query('SELECT * FROM users WHERE user_id=$1;', [req.params.id]);
    promise.then(function(result) {
        let obj = {
            name: result.rows[0].user_name,
            email: result.rows[0].user_email
        }
        return res.status(200).json(obj);
    }).catch(function(err) {
        return next(err);
    });
}

//update data in db (don't allow updating passwords for now)
//only name and email can be updated
//later, only should allow logged in user to edit their own profile
exports.user_update = [

    body('name', 'Name must be specified').trim().isLength({min: 1, max: 30}).escape(),
    body('email', 'Email must be specified').trim().isLength({min: 1, max: 30}).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(500).json({ name: req.body.name, email: req.body.email });
        }else{
            let promise = db.query('UPDATE users SET user_name=$1, user_email=$2 WHERE user_id=$3;', [req.body.name, req.body.email, req.params.id]);
            promise.then(function(result) {
                return res.status(200).json({message: 'user updated'}); 
            }).catch(function(err) {
                return next(err);
            });
        }
    }
]

//this gets complicated when we need to delete a bunch of answers/questions/votes belonging to a user before we can delete user
//  for now, just delete the user
//later, only should allow logged in user to delete their own profile
exports.user_delete = async function(req, res, next) {
    try{
        const queryText = `
            DELETE FROM users WHERE user_id=$1;
        `;
        const result = await db.query(queryText, [req.params.id]);
        return res.status(200).json({message: 'user deleted' });
    }catch(err){
        return next(err);
    }
}


const user_compute_weights = async function(user_id) {
    const BASE_WEIGHT = 100;
    try{
        const queryText = `
            SELECT questions.question_topic, COUNT(votes.vote_id) FROM votes
            INNER JOIN answers ON votes.vote_answer=answers.answer_id
            INNER JOIN questions ON answers.answer_question=questions.question_id
            WHERE answers.answer_user=$1
            GROUP BY questions.question_topic;
        `;
        const result = await db.query(queryText, [user_id]); 

        for(let i = 0; i < result.rows.length; i++) {
            result.rows[i].count = parseFloat(result.rows[i].count) + BASE_WEIGHT;
        }

        return result.rows;
    }catch(err){
        throw err;
    }
}

module.exports.user_compute_weights = user_compute_weights;
