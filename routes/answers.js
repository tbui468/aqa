const router = require('express').Router();
const AuthService = require('./../services/auth');
const AnswersService = require('./../services/answers');
const ValidationService = require('./../services/validation');

router.get('/:question_id/answers', 
    [
        async (req, res, next) => {
            try{
                const answers = await AnswersService.get_answers_list(req.params.question_id);
                return res.json(answers);
            }catch(err){
                return next(err);
            }
        }
    ]
);

router.get('/:question_id/answers/:answer_id', 
    [
        async (req, res, next) => {
            try{
                const answer = await AnswersService.get_answer(req.params.answer_id);
                return res.json(answer);
            }catch(err){
                return next(err);
            }
        }
    ]
);

router.post('/:question_id/answers', 
    [
        AuthService.logged_in,
        AuthService.not_own_question,
        ValidationService.validate_answer,
        async (req, res, next) => {
            try{
                await AnswersService.post_answer(req.body.text, req.user.user_id, req.params.question_id);
                return res.json({ message: 'answer posted' });
            }catch(err){
                return next(err);
            }
        }
    ]
);

router.delete('/:question_id/answers/:answer_id', 
    [
        AuthService.logged_in,
        AuthService.owns_answer,
        async (req, res, next) => {
            try{
                await AnswersService.remove_answer(req.params.answer_id);
                return res.json({ message: 'answers and dependent votes removed' });
            }catch(err){
                return next(err);
            }
        }
    ]
);

router.post('/:question_id/answers/:answer_id/votes', 
    [
        AuthService.logged_in, 
        AuthService.not_own_answer,
        async (req, res, next) => {
            try{
                await AnswersService.vote_for_answer(req.user.user_id, req.params.answer_id, req.params.question_id);
                return res.json({ message: 'voted' });
            }catch(err){
                return next(err);
            }
        }
    ]
);

router.get('/:question_id/answers/:answer_id/votes', 
    [
        async (req, res, next) => {
            try{
                const votes = await AnswersService.find_all_votes(req.params.answer_id);
                return res.json(votes);
            }catch(err){
                return next(err);
            }
        }
    ]
);

router.delete('/:question_id/answers/:answer_id/votes/:vote_id', 
    [
        AuthService.logged_in,
        AuthService.owns_vote,
        async (req, res, next) => {
            try{
                await AnswersService.remove_vote(req.params.vote_id);
                return res.status(200).json({ message: 'vote removed' });
            }catch(err){
                return next(err);
            }
        }
    ]
);


module.exports = router;
