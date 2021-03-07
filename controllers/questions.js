const db = require('./../db/index');
const { body, validationResult } = require('express-validator');

exports.question_list = async function(req, res, next) {
    try{
        const queryText = `
            SELECT questions.question_id, questions.question_text, users.user_name, questions.question_date
            FROM questions INNER JOIN users ON questions.question_user=users.user_id
            ORDER BY questions.question_date ASC;
        `;
        const result = await db.query(queryText, []);
        return res.status(200).json(result.rows);
    }catch(err){
        return next(err);
    }
}

/*
  question_text TEXT,
  question_user INTEGER REFERENCES users (user_id)*/
/*
INSERT INTO questions (question_text, question_date, question_user) 
              VALUES ('Are birds real?', current_timestamp, (SELECT user_id FROM users WHERE user_name='John'));*/

//test using curl and posting to this route with json body
exports.question_create = [
    body('text', 'Question needs to be between 1 and 280 characters').trim().isLength({ min: 1, max: 280 }).escape(),
    body('user_id', 'Author id must be provided').trim().isLength({ min: 1 }).escape(),
    async (req, res, next) => {
        //need to make sure user_id matches someone in the database before inserting question
    }
]

exports.question_show = async function(req, res, next) {

    try{
        const client = await db.getClient();

        const questionQuery = `
            SELECT questions.question_text, users.user_name, questions.question_date
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

        let obj = {
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
