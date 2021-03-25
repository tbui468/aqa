const UserModel = require('./../models/user');
const VoteModel = require('./../models/vote');
const AnswerModel = require('./../models/answer');
const QuestionModel = require('./../models/question');
const bcrypt = require('bcryptjs');


class UsersService {
    static async signup(username, password, email) {
        try{
            bcrypt.hash(password, 10, async (err, hashedpw) => {
                if(err) { throw err; }
                try{
                    await UserModel.create(username, hashedpw, email);
                    return { message: 'user created' };
                }catch(err){
                    throw err;
                }
            });
        }catch(err){
            throw err;
        }
    }

    //this will take the place of /profile, and replace it with /users/profile -> /user/:user_id
    //this will automatically grab the user_id from the cookie and redirect to the correct profile data
    //
    static async show_user(user_id) {
        try{
            const user = await UserModel.find_by_id(user_id);
            const weights = await UserModel.compute_weights(user_id);
            user[0].weights = weights;
            return user;
        }catch(err){
            throw err;
        }
    }

    static async get_list() {
        try{
            const users = await UserModel.find_all();
            return users
        }catch(err){
            throw err;
        }
    }

    static async delete_user(user_id) {
        try{
            await UserModel.delete_by_id(user_id);
            return { message: 'user deleted' };
        }catch(err){
            throw err;
        }
    }

}


module.exports = UsersService;
