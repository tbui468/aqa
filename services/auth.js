const QuestionModel = require('./../models/question');
const AnswerModel = require('./../models/answer');
const VoteModel = require('./../models/vote');


class AuthService {
    static logged_in(req, res, next) {
        if(!req.user) {
            return res.status(404).json({ message: 'log in to access this page' });
        }else{
            next();
        }
    };

    static owns_profile(req, res, next) {
        if(req.user_user_id != req.params.id) {
            return res.status(404).json({ message: 'You are not the owner of this profile' });
        }else{
            next();
        }
    };

    static async owns_question(req, res, next) {
        try{
            const id = req.user.user_id;
            const question = await QuestionModel.find_by_id(req.params.question_id);
            if(parseFloat(question[0].question_user) === parseFloat(id)) {
                next();
            }else{
                return res.status(404).json({ message: 'You are not the owner of this question' });
            }
        }catch(err){
            return res.status(404).json({ message: 'Error connecting to database' });
        }
    };


    static async not_own_question(req, res, next) {
        try{
            const id = req.user.user_id;
            const question = await QuestionModel.find_by_id(req.params.question_id);
            if(parseFloat(question[0].question_user) !== parseFloat(id)) {
                next();
            }else{
                return res.status(404).json({ message: 'You are the owner of this question!' });
            }
        }catch(err){
            return res.status(404).json({ message: 'Error connecting to database' });
        }
    };

    static async owns_answer(req, res, next) {
        try{
            const id = req.user.user_id;
            const answer = await AnswerModel.find_by_id(req.params.answer_id);
            if(parseFloat(answer[0].answer_user) === parseFloat(id)) {
                next();
            }else{
                return res.status(404).json({ message: 'You are not the owner of this answer' });
            }
        }catch(err){
            return res.status(404).json({ message: 'Error connecting to database' });
        }
    };

    static async not_own_answer(req, res, next) {
        try{
            const id = req.user.user_id;
            const answer = await AnswerModel.find_by_id(req.params.answer_id);
            if(parseFloat(answer[0].answer_user) !== parseFloat(id)) {
                next();
            }else{
                return res.status(404).json({ message: 'You are the owner of this answer!' });
            }
        }catch(err){
            return res.status(404).json({ message: 'Error connecting to database' });
        }
    };

    static async owns_vote(req, res, next) {
        try{
            const id = req.user.user_id;
            const vote = await VoteModel.find_by_id(req.params.vote_id);
            if(parseFloat(vote[0].vote_user) === parseFloat(id)) {
                next();
            }else{
                return res.status(404).json({ message: 'You are not the owner of this question' });
            }
        }catch(err){
            return res.status(404).json({ message: 'Error connecting to database' });
        }
    };
}


module.exports = AuthService;
