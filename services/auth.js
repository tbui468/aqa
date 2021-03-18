class AuthService {
    static logged_in(req, res, next) {
        if(!req.user) {
            return res.status(404).json({ message: 'log in to access this page' });
        }else{
            next();
        }
    };

    static owns_profile(req, res, next) {
        if(req.user_user_id != req.params.id) {
            return res.status(404).json({ message: 'You are not the owner of this profile' });
        }else{
            next();
        }
    };
}


module.exports = AuthService;
