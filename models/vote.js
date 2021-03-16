const db = require( './../db/index');

class VoteModel {

    static async create(user_id, answer_id) {
        try{
            const createText = `
                INSERT INTO votes
                    (vote_date, vote_user, vote_answer)
                VALUES
                    (current_timestamp, $1, $2);
            `;
            await db.query(createText, [user_id, answer_id]);
            return { message: 'vote created' };
        }catch(err){
            throw err;
        }
    }

    static async delete_by_user_and_question(user_id, question_id) {
        try{
            const queryText = `
                DELETE FROM votes
                WHERE votes.vote_answer
                IN (SELECT answers.answer_id FROM answers WHERE votes.vote_user=$1 AND answers.answer_question=$2);
            `;

            await db.query(queryText, [user_id, question_id]);

            return { message: 'Vote deleted' };
        }catch(err){
            throw err;
        }
    }
};

module.exports = VoteModel;

