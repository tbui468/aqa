const QuestionModel = require('./../models/question');
const AnswerModel = require('./../models/answer');


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
            const answers = await AnswerModel.find_by_question(question_id);
            let question_weight = 0;
            for(let i = 0; i < answers.length; i++) {
                question_weight += parseFloat(answers[i].answer_weight);
            }

            question[0].question_weight = question_weight;

            const obj = {
                question: question[0],
                answers: answers,
            }
            return obj;
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

    static async delete_question(question_id) {
        try{
            await QuestionModel.delete_by_id(question_id);
            return { message: 'Question deleted' };
        }catch(err){
            throw err;
        }
    }

}


module.exports = QuestionsService;
