const router = require('express').Router();
const authorizationsController = require('./../controllers/authorizations');
const answersController = require('./../controllers/answers');
const votesController = require('./../controllers/votes');
const VotesService = require('./../services/votes');

//route prefix is /questions/:question_id/answers
router.get('/:question_id/answers', answersController.answer_list);
router.get('/:question_id/answers/:answer_id', answersController.answer_show);
//router.get('/new', answersController.answer_new);
router.post('/:question_id/answers', [authorizationsController.logged_in, answersController.answer_create]);
//router.put('/:answer_id', answersController.answer_update);
//router.get('/:answer_id/edit', answersController.answer_edit);
router.delete('/:question_id/answers/:answer_id', [authorizationsController.logged_in, authorizationsController.owns_answer, answersController.answer_delete]);

//votes - this is messy.  There's got to be a better way to organize these nested routes
//router.post('/:question_id/answers/:answer_id/votes', [authorizationsController.logged_in, votesController.vote_create]);
router.post('/:question_id/answers/:answer_id/votes', [authorizationsController.logged_in, 
    async (req, res, next) => {
        try{
            await VotesService.vote(req.user.user_id, req.params.answer_id, req.params.question_id);
            return res.json({ message: 'voted' });
        }catch(err){
            return next(err);
        }
    }]);

router.get('/:question_id/answers/:answer_id/votes', votesController.vote_list);
router.delete('/:question_id/answers/:answer_id/votes/:vote_id', [authorizationsController.logged_in, authorizationsController.owns_vote, votesController.vote_delete]);


module.exports = router;
