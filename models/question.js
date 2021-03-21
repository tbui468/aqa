const db = require('./../db/index')

class QuestionModel {

    static async create(text, user_id) {
        try{
            const queryText = `
                INSERT INTO questions
                    (question_text, question_date, question_user) 
                VALUES
                    ($1, current_timestamp, $2)
                RETURNING question_id;
            `;

            const result = await db.query(queryText, [text, user_id]);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async update_topic(question_id, topic) {
        try{
            const queryText = `
                UPDATE questions
                SET question_topic = $2
                WHERE question_id = $1;
            `;
            await db.query(queryText, [question_id, topic])
            return { message: 'Question updated' };
        }catch(err){
            throw err;
        }
    }

    static async find_all() {
        try{
            const queryText = `
                SELECT * FROM questions
                ORDER BY questions.question_date DESC;
            `;

            const result = await db.query(queryText, []);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async find_by_id(question_id) {
        try{
            const queryText = `
                SELECT * FROM questions
                WHERE questions.question_id = $1;
            `;

            const result = await db.query(queryText, [question_id]);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async delete_by_id(question_id) {
        try{
            const queryText = `
                DELETE FROM questions
                WHERE questions.question_id = $1;
            `;
            await db.query(queryText, [question_id]);
            return { message: 'Question deleted' };
        }catch(err){
            throw err;
        }
    }

}

module.exports = QuestionModel;
