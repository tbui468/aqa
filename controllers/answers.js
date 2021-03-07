const db = require('./../db/index');
const { body, validationResult } = require('express-validator');

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

exports.answer_show = async function(req, res, next) {
    try{
        const queryText = `
            SELECT answers.answer_text, answers.answer_date, users.user_name
            FROM answers INNER JOIN users ON answers.answer_user=users.user_id
            WHERE answers.answer_question=$1 AND answers.answer_id=$2;
        `;
        const result = await db.query(queryText, [req.params.question_id, req.params.answer_id]);
        return res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};
//req.params.question_id
//req.user (and all key/values that comes with)
/*
CREATE TABLE answers(
  answer_id SERIAL PRIMARY KEY,
  answer_text TEXT,
  answer_date DATE,
  answer_user INTEGER REFERENCES users (user_id),
  answer_question INTEGER REFERENCES questions (question_id)
);*/
/*
INSERT INTO answers (answer_text, answer_date, answer_user, answer_question) 
          VALUES ('No, birds are part of the simulation',
                    current_timestamp,
                    (SELECT user_id FROM users WHERE user_name='Kappy'),
                    (SELECT question_id FROM questions WHERE question_id=1));
          */
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
}
