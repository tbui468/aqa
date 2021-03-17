const AnswerModel = require('./../models/answer');
const VoteModel = require('./../models/vote');


class AnswerService {
    static async post_answer(answer_text, user_id, question_id) {
        try{
            await AnswerModel.create(answer_text, user_id, question_id);
        }catch(err){
            throw err;
        }
    }

    static async get_answers_list(question_id) {
        try{
            const queryText = `
                SELECT * FROM answers
                WHERE answers.answer_question = $1;
            `;

            const result = await db.query(queryText, [question_id]);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async get_answer(answer_id) {
        try{
            const queryText = `
                SELECT * FROM answers
                WHERE answers.answer_id = $1;
            `;
            const result = await db.query(queryText, [answer_id]);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async vote_for_answer(user_id, answer_id, question_id) {
        try{
            await VoteModel.delete_by_user_and_question(user_id, question_id);
            await VoteModel.create(user_id, answer_id);
            return { message: 'voted for answer' };
        }catch(err){
            throw err;
        }
    }

    static async remove_vote(vote_id) {
        try{
            await VoteModel.delete_by_id(vote_id);
            return { message: 'voted deleted' }
        }catch(err){
            throw err;
        }
    }

    static async find_all_votes(answer_id) {
        try{
            const votes = await VoteModel.find_by_answer(answer_id);
            return votes;
        }catch(err){
            throw err;
        }
    }

    static async remove_answer(answer_id) {
        try{
            await VoteModel.delete_by_answer(answer_id);
            await AnswerModel.delete_by_id(answer_id);
            return { message: 'answers and dependent votes removed' };
        }catch(err){
            throw err;
        }
    }
}

module.exports = AnswerService;
