const router = require('express').Router();
const usersController = require('./../controllers/users');

//  7 REST routes naming conventions
  //  Index - /blogs - GET - show all blog posts
  //  New - /blogs/new - GET - show form to make new blogs
  //  Create - /blogs - POST - Add to blog to db and redirect
  //  Show - /blogs/:id - GET - show detail about 1 bloga
  //  Edit - /blogs/:id/edit - GET - show edit form
  //  Update - /blogs/:id - PUT - update blog and redirect
  //  Destroy - /blogs/:id - DELTE - delete blog from db and redirect


router.get('/', usersController.user_index); //should only allow admins to see this
router.get('/new', usersController.user_new);
router.post('/', usersController.user_create);
router.get('/:id', [usersController.user_authorize, usersController.user_show]);
router.get('/:id/edit', [usersController.user_authorize, usersController.user_edit]);
router.put('/:id', [usersController.user_authorize, usersController.user_update]);
router.delete('/:id', [usersController.user_authorize, usersController.user_delete]);

module.exports = router;
