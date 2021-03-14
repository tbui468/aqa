const router = require('express').Router();
const votesController = require('./../controllers/votes');

router.get('/', votesController.vote_index);

module.exports = router;
