const QuestionModel = require('./../models/question');


class QuestionsService {

    static async post_question(text, topic, user_id) {
        try{
            await QuestionModel.create(text, topic, user_id);
            return { message: 'question posted' };
        }catch(err){
            throw err;
        }
    }

    static async show_detail(question_id) {
        try{
            const question = await QuestionModel.find_by_id(question_id);
            return question;
        }catch(err){
            throw err;
        }
    }

    static async get_list() {
        try{
            const questions = await QuestionModel.find_all();
            return questions;
        }catch(err){
            throw err;
        }
    }

}


module.exports = QuestionsService;
