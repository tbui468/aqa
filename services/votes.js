const VoteModel = require('./../models/vote');


class VotesService {
    static async vote(user_id, answer_id, question_id) {
        try{
            await VoteModel.delete_by_user_and_question(user_id, question_id);
            await VoteModel.create(user_id, answer_id);
            return { message: 'voted for answer' };
        }catch(err){
            throw err;
        }
    }
};

module.exports = VotesService;
