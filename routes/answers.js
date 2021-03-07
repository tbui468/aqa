const router = require('express').Router();
const authorizationsController = require('./../controllers/authorizations');
const answersController = require('./../controllers/answers');

//route prefix is /questions/:question_id/answers
router.get('/:question_id/answers', answersController.answer_list);
router.get('/:question_id/answers/:answer_id', answersController.answer_show);
//router.get('/new', answersController.answer_new);
router.post('/:question_id/answers', [authorizationsController.logged_in, answersController.answer_create]);
//router.put('/:answer_id', answersController.answer_update);
//router.get('/:answer_id/edit', answersController.answer_edit);
router.delete('/:question_id/answers/:answer_id', [authorizationsController.logged_in, authorizationsController.owns_answer, answersController.answer_delete]);


module.exports = router;
