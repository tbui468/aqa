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

    static async compute_weights(user_id) {
        try{
            //default weights
            const topicQuery = `
                SELECT to_json(ENUM_RANGE(null::topic));
            `;

            const result0 = await db.query(topicQuery, []);

            let weights = [];

            for(let i = 0; i < result0.rows[0].to_json.length; i++) {
                const obj = {
                    question_topic: result0.rows[0].to_json[i],
                    count: '100'
                };
                weights.push(obj);
            }

            const queryText = `
                SELECT questions.question_topic, COUNT(*) + 100 AS count FROM votes
                INNER JOIN answers ON answers.answer_id = votes.vote_answer
                INNER JOIN questions ON questions.question_id = answers.answer_question
                WHERE answers.answer_user = $1
                GROUP BY questions.question_topic;
            `;

            const result = await db.query(queryText, [user_id]);
            
            //update default weights if topic weight was found
            for(let i = 0; i < result.rows.length; i++) {
                const topic = result.rows[i].question_topic;
                const count = result.rows[i].count;
                for(let j = 0; j < weights.length; j++) {
                    if(weights[j].question_topic === topic) weights[j].count = count;
                }
            }
            
            return weights;
        }catch(err){
            throw err;
        }
    }
}


module.exports = UserModel;
