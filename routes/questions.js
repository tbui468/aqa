//const Router = require('express-promise-router'); //this doesn't seem to change anything, even though node pg recommended this
//const router = new Router();
const router = require('express').Router();
const questionsController = require('./../controllers/questions');
const authorizationsController = require('./../controllers/authorizations');

router.get('/', questionsController.question_list);
//router.get('/new', [authorizationsController.logged_in, questionsController.question_new]); //@todo
//router.post('/', [authorizationsController.logged_in, questionsController.question_create]); //@todo
router.get('/:id', questionsController.question_show);
//router.get('/:id/edit', [authorizationsController.logged_in, authorizationsController.owns_question, questionsController.user_edit]); //@todo
//router.put('/:id', [authorizationsController.logged_in, authorizationsController.owns_question, questionsController.user_update]); //@todo
//router.delete('/:id', [authorizationsController.logged_in, authorizationsController.owns_question, questionsController.user_delete]); //@todo

module.exports = router;
