const db = require('./../db/index');


exports.is_admin = function(req, res, next) {
//@todo
    next();
};


//only allow users to see/edit own profile
exports.logged_in = function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access this page" });
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

exports.owns_question = async function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the question page" });
    }else{
        try{
            const queryText = `
                SELECT * FROM questions WHERE question_id=$1; 
            `;
            const result = await db.query(queryText, [req.params.id]);
            if(result.rows[0].question_user !== req.user.user_id) {
                return res.status(404).json({ message: "You are not the author of this question!" });
            }else{
                next();
            }
        }catch(err){
            return next(err);
        }
    }
};

exports.owns_answer = async function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the question page" });
    }else{
        try{
            const queryText = `
                SELECT * FROM answers WHERE answer_id=$1 AND answer_user=$2; 
            `;
            const result = await db.query(queryText, [req.params.answer_id, req.user.user_id]);
            if(result.rows.length === 0) {
                return res.status(404).json({ message: "You are not the author of this question!" });
            }else{
                next();
            }
        }catch(err){
            return next(err);
        }
    }
};

exports.owns_vote = async function(req, res, next) {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the vote page" });
    }else{
        try{
            const queryText = `
                SELECT * FROM votes
                WHERE vote_user=$1 AND vote_id=$2;
            `;
            const result = await db.query(queryText, [req.user.user_id, req.params.vote_id]);
            if(result.rows.length === 0) {
                return res.status(400).json({ message: "You are not the owner of this vote" });
            }else{
                next();
            }
        }catch(err){
            return next(err);
        }
    }
}
