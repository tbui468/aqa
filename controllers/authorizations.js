const db = require('./../db/index');


exports.is_admin = function(req, res, next) {
//@todo
    next();
};


//only allow users to see/edit own profile
exports.logged_in = function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the profile page" });
    }else{
        next();
    }
};

exports.owns_profile = function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the profile page" });
    }else if(req.user.user_id != req.params.id){
        return res.status(404).json({ message: "You are not the user of this profile" });
    }else{
        next();
    }
};

//@todo
exports.owns_question = function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the question page" });
    }else{
        //query database for question foreign key (question_user) to see if it matches req.user.user_id
        //if not, return "Not owner of this question"
        //else go to next 
    }
};

//@todo
exports.owns_answer = function(req, res, next) {
    next();
};
