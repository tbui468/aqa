//const Router = require('express-promise-router'); //this doesn't seem to change anything, even though node pg recommended this
//const router = new Router();
const router = require('express').Router();
const questionsController = require('./../controllers/questions');

router.get('/', questionsController.question_list);
router.get('/:id', questionsController.question_detail);

module.exports = router;
