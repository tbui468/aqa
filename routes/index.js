const router = require('express').Router();
const indexController = require('./../controllers/index');

//seems silly to have one function in indexController, so just putting callback directly here
router.get('/', indexController.index);

module.exports = router;
