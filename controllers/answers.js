const db = require('./../db/index');
const { body, validationResult } = require('express-validator');
const { user_compute_weights } = require('./users');

exports.answer_list = async function(req, res, next) {
    try{
        const queryText = `
            SELECT answers.answer_text, answers.answer_date, users.user_name, answers.answer_id
            FROM answers INNER JOIN users ON answers.answer_user=users.user_id
            WHERE answers.answer_question=$1
            ORDER BY answers.answer_date ASC;
        `;
        const result = await db.query(queryText, [req.params.question_id]);
        return res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};

//put votes here
exports.answer_show = async function(req, res, next) {
    try{
        const queryText = `
            SELECT answers.answer_text, answers.answer_date, users.user_name
            FROM answers INNER JOIN users ON answers.answer_user=users.user_id
            WHERE answers.answer_question=$1 AND answers.answer_id=$2;
        `;
        const result = await db.query(queryText, [req.params.question_id, req.params.answer_id]);
        const weight = await answer_compute_weight(req.params.answer_id);
        const obj = {
            percent: weight,
            answer: result.rows[0]
        }
        return res.status(200).json(obj);
    }catch(err){
        next(err);
    }
};

exports.answer_create = [
    body('text', 'Invalid answer').trim().isLength({ min: 1, max: 280 }).escape(),
    async (req, res, next) => {
        //returns error if user attempts to answer own question
        try{
            const queryText = `
                SELECT * FROM questions
                WHERE questions.question_id=$1;
            `;
            const result = await db.query(queryText, [req.params.question_id]);
            if(result.rows[0].question_user.toString() === req.user.user_id.toString()) {
                return res.status(404).json({ message: 'Question askser cannot answer own question!' });
            }
        }catch(err){
            return next(err);
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
           return next(err); 
        }else{
            try{
                const queryText = `
                    INSERT INTO answers (answer_text, answer_date, answer_user, answer_question)
                    VALUES ($1, current_timestamp, $2, $3);
                `;
                const result = db.query(queryText, [req.body.text, req.user.user_id, req.params.question_id]);
                return res.status(200).json({ message: "Answer added to database" });
            }catch(err){
                return next(err);
            }
        }
    }
];

exports.answer_delete = async function(req, res, next) {
    try{
        const queryText = `
            DELETE FROM answers
            WHERE answers.answer_question=$1 AND answers.answer_id=$2;
        `;
        await db.query(queryText, [req.params.question_id, req.params.answer_id]);
        return res.status(200).json({ message: "Answer removed from database" });
    }catch(err){
        return next(err);
    }
};

//answer weight should be equal the the weights of the users who voted for the answer
const answer_compute_weight = async function(answer_id) {
    let weight = 0;
    try{

        const queryText0 = `
            SELECT questions.question_topic FROM answers
            INNER JOIN questions ON answers.answer_question=questions.question_id
            WHERE answers.answer_id=$1;
        `;
        const result0 = await db.query(queryText0, [answer_id]);
        const topic = result0.rows[0].question_topic;

        const queryText1 = `
            SELECT * FROM votes
            WHERE votes.vote_answer=$1;
        `;
        const result1 = await db.query(queryText1, [answer_id]); //find all votes for this answer (one should be catherine, and the other bob)
        
        for(let i = 0; i < result1.rows.length; i++) {
            const weights = await user_compute_weights(result1.rows[i].vote_user); 
            let found = false;
            for(let j = 0; j < weights.length; j++) {
                if(topic === weights[j].question_topic) {
                    weight += parseFloat(weights[j].count);
                    found = true;
                }
            }
            if(!found){ //use default if topic weight was not found
                weight += 100;
            }
        }

    }catch(err){
        throw err;
    }
    return weight;
}

exports.answer_voted_for = async function(user_id, answer_id) {
    const queryText = `
        SELECT * FROM votes
        WHERE votes.vote_user=$1 AND votes.vote_answer=$2;
    `;
    const result = await db.query(queryText, [user_id, answer_id]);
    if(result.rows.length > 0) return true;
    else return false;
}


module.exports.answer_compute_weight = answer_compute_weight;

