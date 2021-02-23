const router = require('express').Router();
const postsController = require('./../controllers/posts');

router.get('/', postsController.post_list);

module.exports = router;
