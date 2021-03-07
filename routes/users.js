const router = require('express').Router();
const usersController = require('./../controllers/users');
const authorizationsController = require('./../controllers/authorizations');

//  7 REST routes naming conventions
  //  Index - /blogs - GET - show all blog posts
  //  New - /blogs/new - GET - show form to make new blogs
  //  Create - /blogs - POST - Add to blog to db and redirect
  //  Show - /blogs/:id - GET - show detail about 1 bloga
  //  Edit - /blogs/:id/edit - GET - show edit form
  //  Update - /blogs/:id - PUT - update blog and redirect
  //  Destroy - /blogs/:id - DELTE - delete blog from db and redirect

router.get('/', authorizationsController.is_admin, usersController.user_index);
router.get('/new', usersController.user_new); //@todo: should have front end get and display the fields necessary from backend dynamically
router.post('/', usersController.user_create);
router.get('/:id', [authorizationsController.logged_in, authorizationsController.owns_profile, usersController.user_show]);
router.get('/:id/edit', [authorizationsController.logged_in, authorizationsController.owns_profile, usersController.user_edit]);
router.put('/:id', [authorizationsController.logged_in, authorizationsController.owns_profile, usersController.user_update]);
router.delete('/:id', [authorizationsController.logged_in, authorizationsController.owns_profile, usersController.user_delete]);

module.exports = router;
