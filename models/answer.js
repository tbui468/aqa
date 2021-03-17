const db = require('./../db/index')

class AnswerModel {

    static async create(answer_text, user_id, question_id) {
        try{
            const queryText = `
                INSERT INTO answers
                    (answer_text, answer_date, answer_user, answer_question) 
                VALUES
                    ($1, current_timestamp, $2, $3);
            `;

            await db.query(queryText, [answer_text, user_id, question_id]);
            return { message: "Answer added to db" };
        }catch(err){
            throw err;
        }
    }

    static async find_by_user_and_question(user_id, question_id){
        try{
            const queryText = `
                SELECT * FROM answers
                WHERE answers.answer_user=$1 AND answers.answer_question=$2;
            `;
            const result = await db.query(queryText, [user_id, question_id]);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async delete_by_id(answer_id) {
        try{
            const queryText = `
                DELETE FROM answers
                WHERE answers.answer_id = $1;
            `;

            await db.query(queryText, [answer_id]);
            return { message: 'answer deleted' };
        }catch(err){
            throw err;
        }
    }

    static async delete_by_user(user_id) {
        try{
            const queryText = `
                DELETE FROM answers
                WHERE answers.answer_user = $1;
            `;

            await db.query(queryText, [user_id]);
            return { message: 'answer(s) deleted' };
        }catch(err){
            throw err;
        }
    }

}

module.exports = AnswerModel;
