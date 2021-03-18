const router = require('express').Router();
const AuthService = require('./../services/auth');
const QuestionsService = require('./../services/questions');
const ValidationService = require('./../services/validation');

//@todo: sanitize/validate text and topic before allow user to post

router.get('/', 
    [
        async (req, res, next) => {
            try{
                const questions = await QuestionsService.get_list();
                return res.json(questions);
            }catch(err){
                next(err);
            }
        }
    ]
);
router.post('/', 
    [
        AuthService.logged_in,
        ValidationService.validate_question,
        async (req, res, next) => {
            try{
                await QuestionsService.post_question(req.body.text, req.body.topic, req.user.user_id);
                return res.json({ message: 'Question posted' });
            }catch(err){
                next(err);
            }
        }
    ]
);
router.get('/:question_id',
    [
        async (req, res, next) => {
            try{
                const question = await QuestionsService.show_detail(req.params.question_id);
                return res.json(question);
            }catch(err){
                next(err);
            }
        }
    ]
);
router.delete('/:question_id', 
    [
        AuthService.logged_in,
        AuthService.owns_question,
        async (req, res, next) => {
            try{
                await QuestionsService.delete_question(req.params.question_id);
                return res.json({ message: 'Question deleted' });
            }catch(err){
                next(err);
            }
        }
    ]
);

module.exports = router;
