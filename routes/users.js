const router = require('express').Router();
const usersController = require('./../controllers/users');

router.get('/', usersController.user_list);
router.get('/:id', usersController.user_detail);

module.exports = router;
