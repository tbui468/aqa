const db = require('./../db/index');

class UserModel {
    static async create(username, password, email) {
        try{
            const queryText = `
                INSERT INTO users 
                    (user_name, user_password, user_email)
                VALUES
                    ($1, $2, $3);
            `;

            await db.query(queryText, [username, password, email]);
            return { message: 'user created' };
        }catch(err){
            throw err;
        }
    }

    static async find_by_id(user_id) {
        try{
            const queryText = `
                SELECT * FROM users
                WHERE users.user_id = $1;
            `;

            const result = await db.query(queryText, [user_id]);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async find_all() {
        try{
            const queryText = `
                SELECT * FROM users;
            `;

            const result = await db.query(queryText, []);
            return result.rows;
        }catch(err){
            throw err;
        }
    }

    static async delete_by_id(user_id) {
        try{
            const queryText = `
                DELETE FROM users
                WHERE users.user_id = $1;
            `;

            await db.query(queryText, [user_id]);
            return { message: 'user deleted' };
        }catch(err){
            throw err;
        }
    }
}


module.exports = UserModel;
