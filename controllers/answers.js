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
        const weight = await answer_compute_weight(req.params.answer_id); //temp
        const obj = {
            weight: weight,
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
        const result = await db.query(queryText, [req.params.question_id, req.params.answer_id]);
        return res.status(200).json({ message: "Answer removed from database" });
    }catch(err){
        return next(err);
    }
};

const answer_compute_weight = async function(answer_id) {
    let weight = 0;
    try{
        const client = await db.getClient(); //get topic

        //get topic
        try{
            const queryText0 = `
                SELECT questions.question_topic FROM answers
                INNER JOIN questions ON answers.answer_question=questions.question_id
                WHERE answers.answer_id=$1;
            `;
            const result0 = await client.query(queryText0, [answer_id]);
            const topic = result0.rows[0].question_topic;

            const queryText1 = `
                SELECT users.user_id FROM votes
                INNER JOIN users ON votes.vote_user=users.user_id
                WHERE votes.vote_answer=$1;
            `;
            const result1 = await client.query(queryText1, [answer_id]);
            for(let i = 0; i < result1.rows.length; i++) {
                const weights = await user_compute_weights(result1.rows[i].user_id); 
                for(let j = 0; j < weights.length; j++) {
                    if(topic === weights[j].question_topic) weight += parseFloat(weights[j].count);
                    else weight += 100;
                }
            }
        }catch(err){
            client.release();
            throw err;
        }

        client.release();
    }catch(err){
        throw err;
    }
    return weight;
}

module.exports.answer_compute_weight = answer_compute_weight;

