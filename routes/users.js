const router = require('express').Router();
const usersController = require('./../controllers/users');

router.get('/', usersController.user_list);

module.exports = router;
