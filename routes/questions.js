const router = require('express').Router();
const questionsController = require('./../controllers/questions');

router.get('/', questionsController.question_list);
router.get('/:id', questionsController.question_detail);

module.exports = router;
