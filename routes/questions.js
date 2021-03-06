//const Router = require('express-promise-router'); //this doesn't seem to change anything, even though node pg recommended this
//const router = new Router();
const router = require('express').Router();
const questionsController = require('./../controllers/questions');

router.get('/', questionsController.question_list);
//router.get('/new', questionsController.question_new); //not really using this now, but should base front end form off this data
//router.post('/', questionsController.question_create);
router.get('/:id', questionsController.question_show);
/*
router.get('/:id/edit', questionsController.user_edit);
router.put('/:id', questionsController.user_update);
router.delete('/:id', questionsController.user_delete);*/

module.exports = router;
