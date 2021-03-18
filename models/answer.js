const db = require('./../db/index')
const UserModel = require('./../models/user');

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
    
    static async find_by_id(answer_id) {
        try{
            const queryText = `
                SELECT * FROM answers
                WHERE answers.answer_id = $1;
            `;

            const result = await db.query(queryText, [answer_id]);
            result.rows[0].answer_weight = await AnswerModel.compute_weight(answer_id);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async find_by_question(question_id) {
        try{
            const queryText = `
                SELECT * FROM answers
                WHERE answers.answer_question = $1;
            `;

            const result = await db.query(queryText, [question_id]);

            for(let i = 0; i < result.rows.length; i++) {
                result.rows[i].answer_weight = await AnswerModel.compute_weight(result.rows[i].answer_id);
            }

            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async compute_weight(answer_id) {
        const questionQueryText = `
            SELECT questions.question_topic FROM answers
            INNER JOIN questions ON questions.question_id = answers.answer_question
            WHERE answers.answer_id = $1;
        `;
        const result = await db.query(questionQueryText, [answer_id]);
        const topic = result.rows[0].question_topic;

        const voteQueryText = `
            SELECT * FROM votes
            WHERE votes.vote_answer = $1;
        `;
        const votes = await db.query(voteQueryText, [answer_id]);

        let sum = 0;

        for(let i = 0; i < votes.rows.length; i++) {
            const weights = await UserModel.compute_weights(votes.rows[i].vote_user);
            for(let j = 0; j < weights.length; j++) {
                if(weights[j].question_topic === topic) sum += parseFloat(weights[j].count);
            }
        }

        return sum;
    }

}

module.exports = AnswerModel;
