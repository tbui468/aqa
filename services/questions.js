const QuestionModel = require('./../models/question');
const AnswerModel = require('./../models/answer');
const VoteModel = require('./../models/vote');
const fetch = require('node-fetch');


class QuestionsService {

    static async post_question(text, user_id) {
        try{
            const result = await QuestionModel.create(text, user_id);
            const question_id = result[0].question_id;

            const body = { "text": text };
            const fetchResult = await fetch('http://localhost:5000/predict', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                });

            const json = await fetchResult.json();
            const topic = json.topic;
            console.log(topic);

            await QuestionModel.update_topic(question_id, "Education"); //temp: topics return by nn are not part of the enum type yet, so putting in education for default
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
                const votes = await VoteModel.find_by_answer(answers[i].answer_id);
                answers[i].answer_votes = votes;
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
