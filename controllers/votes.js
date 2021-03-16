const db = require('./../db/index');

//get all votes
exports.vote_index = async function(req, res, next) {
    try{
        const queryText = `
            SELECT * FROM votes ORDER BY vote_id ASC;
        `;
        const result = await db.query(queryText, []);
        return res.status(200).json(result.rows);
    }catch(err){
        return next(err);
    }
};

//get all votes for a given answer
exports.vote_list = async function(req, res, next) {
    try{
        const queryText = `
            SELECT * FROM votes
            WHERE votes.vote_answer=$1;
        `;
        const result = await db.query(queryText, [req.params.answer_id]);
        const obj = {
            count: result.rows.length,
            votes: result.rows
        }
        return res.status(200).json(obj);
    }catch(err){
        return next(err);
    }
};

exports.vote_delete = async function(req, res, next) {
    try{
        const queryText = `
            DELETE FROM votes
            WHERE vote_id=$1;
        `;
        const result = await db.query(queryText, [req.params.vote_id]);
        return res.status(200).json({ message: "Vote deleted from database" });
    }catch(err){
        return next(err);
    }
}

exports.vote_create = async function(req, res, next) {
    //if user tries to vote for own answer, return error
    try{
        const queryText = `
            SELECT * FROM answers
            WHERE answers.answer_id=$1;
        `;
        const result = await db.query(queryText, [req.params.answer_id]); //get answer user is trying to vote for
        if(result.rows[0].answer_user.toString() === req.user.user_id.toString())
            return res.status(404).json({ message: 'You cannot vote for your own answer!' });
    }catch(err){
        return next(err);
    }
    try{

        const client = await db.getClient();

        try{
            await client.query('BEGIN');
            //do stuff here in transaction
            const queryDelete = `
                DELETE FROM votes
                WHERE votes.vote_answer
                IN (SELECT answers.answer_id FROM answers WHERE votes.vote_user=$1 AND answers.answer_question=$2);
            `;

            await db.query(queryDelete, [req.user.user_id, req.params.question_id]); //NEED TO DELETE ALLL VOTES THAT BELONG TO QUESTION, NOT ANSWER (since there shouldn't be more than one)

            const queryText2 = `
                INSERT INTO votes (vote_date, vote_user, vote_answer)
                VALUES (current_timestamp, $1, $2);
            `;
            await db.query(queryText2, [req.user.user_id, req.params.answer_id]);
            await client.query('COMMIT');
            client.release();
        }catch(err){
            await client.query('ROLLBACK');
            client.release();
            throw err;
        }

        return res.status(200).json({ message: "Voted for answer" });
    }catch(err){
        return next(err);
    }

};
