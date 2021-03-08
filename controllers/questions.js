const db = require('./../db/index');
const { body, validationResult } = require('express-validator');
const { answer_compute_weight } = require('./answers');


exports.question_list = async function(req, res, next) {
    try{
        const queryText = `
            SELECT questions.question_id, questions.question_text, questions.question_topic, users.user_name
            FROM questions INNER JOIN users ON questions.question_user=users.user_id
            ORDER BY questions.question_date ASC;
        `;
        const result = await db.query(queryText, []);
        return res.status(200).json(result.rows);
    }catch(err){
        return next(err);
    }
}

exports.question_create = [
    body('text', 'Question needs to be between 1 and 280 characters').trim().isLength({ min: 1, max: 280 }).escape(),
    body('topic', 'Topic needs to be between 1 and 280 characters').trim().isLength({ min: 1, max: 280 }).escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.json({ message: "question format invalid" });//@todo: should return list of errors and have react render problems
        }else{
            try{
                const queryText = `
                    INSERT INTO questions (question_text, question_date, question_user)
                    VALUES ($1, current_timestamp, $2);
                `;
                const result = await db.query(queryText, [req.body.text, req.user.user_id]);
                return res.json({ message: "New question posted!" });
            }catch(err){
                return next(err);
            }
        }
    }
]

//@todo: when answers and votes are implemented, need to go through entire database and delete
//answers and votes with foreign keys referencing this question. Or dont and just check and delete 
//when each answer or vote when accessed for the first time after question is deleted (check if foreign keys are valid)
exports.question_delete = async function(req, res, next) {
    try{
        const queryText = `
            DELETE FROM questions WHERE question_id=$1;
        `;
        const result = db.query(queryText, [req.params.id]);
        return res.status(200).json({ message: "Question deleted" });
    }catch(err){
        return next(err);
    }
};

exports.question_show = async function(req, res, next) {

    try{
        const client = await db.getClient();

        const questionQuery = `
            SELECT questions.question_text, questions.question_topic, users.user_name, questions.question_date
            FROM questions INNER JOIN users ON questions.question_user=users.user_id WHERE questions.question_id=$1; 
        `;

        const p0 = await client.query(questionQuery, [req.params.id])
            .catch((err) => {
                client.release();
                throw err;
            });

        const answerQuery = `
            SELECT answers.answer_text, users.user_name, answers.answer_date
            FROM answers INNER JOIN users ON answers.answer_user=users.user_id WHERE answers.answer_question=$1;
        `;

        const p1 = await client.query(answerQuery, [req.params.id])
            .catch((err) => {
                client.release();
                throw err;
            });

        const weight = await question_compute_answers_weight(req.params.id);

        let obj = {
            weight: weight,
            question: p0.rows,
            answer: p1.rows,
        }

        if(p0.rows.length == 0) throw new Error('hi');

        client.release();

        return res.status(200).json(obj);

    }catch(err){
        return next(err);
    }

}

const question_compute_answers_weight = async function(question_id) {
    let weight = 0;
    try{
        const queryText = `
            SELECT answers.answer_id FROM answers
            WHERE answers.answer_question=$1;
        `;
        const result = await db.query(queryText, [question_id]);
        
        for(let i = 0; i < result.rows.length; i++) {
            const answerWeight = await answer_compute_weight(result.rows[i].answer_id);
            weight += answerWeight;
        }
    }catch(err){
        throw err;
    }
    return weight;
}
