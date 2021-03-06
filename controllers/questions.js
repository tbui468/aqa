const db = require('./../db/index');


exports.question_list = async function(req, res, next) {
    const queryText = `
        SELECT questions.question_id, questions.question_text, users.user_name, questions.question_date
        FROM questions INNER JOIN users ON questions.question_user=users.user_id
        ORDER BY questions.question_date ASC;
    `;
    try{
        const result = await db.query(queryText, []);
        return res.status(200).json(result.rows);
    }catch(err){
        return next(err);
    }
}

//use async.parallel or async.waterfall
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
