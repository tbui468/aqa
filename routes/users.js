const router = require('express').Router();
const UsersService = require('./../services/users');
const AuthService = require('./../services/auth');
const ValidationService = require('./../services/validation');

//@todo: validate/sanitize inputs before calling UserServices where input is provided (post and edit)
//@todo: finish delete route for user (need to complete controller, service and model for Answers/Questions/Votes too)

router.get('/', 
    [
        async (req, res, next) => {
            try{
                const users = await UsersService.get_list();
                return res.json(users);
            }catch(err){
                next(err);
            }
        }
    ]
);

router.post('/', 
    [
        ValidationService.validate_name,
        ValidationService.validate_email,
        ValidationService.validate_password,
        async (req, res, next) => {
            try{
                await UsersService.signup(req.body.username, req.body.password, req.body.email);
                return res.json({ message: 'user signed up!' });
            }catch(err){
                next(err);
            }
        }
    ]
);

router.get('/:id', 
    [
        async (req, res, next) => {
            try{
                const user = await UsersService.show_user(req.params.id);
                return res.json(user);
            }catch(err){
                next(err);
            }
        }
    ]
);

router.delete('/:id', 
    [
        AuthService.logged_in,
        AuthService.owns_profile,
        async (req, res, next) => {
            try{
                await UsersService.delete_user(req.params.id);
                return res.json({ message: 'user deleted!' });
            }catch(err){
                next(err);
            }
        }
    ]
);


module.exports = router;
