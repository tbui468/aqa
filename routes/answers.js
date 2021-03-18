const router = require('express').Router();
const authorizationsController = require('./../controllers/authorizations');
const AnswersService = require('./../services/answers');

//@todo: 'put' route for updating answers
//@todo: add compute weight to get :answer_id (need to have UserService done, since we need to compute user weights)
//@todo: create, and reintegrate input validation/sanitization
//@todo: redo authorization/logged in controller into a service, then rewrite/cleanup

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
        authorizationsController.logged_in,
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
        authorizationsController.logged_in,
        authorizationsController.owns_answer,
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
        authorizationsController.logged_in, 
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
        authorizationsController.logged_in,
        authorizationsController.owns_vote,
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
