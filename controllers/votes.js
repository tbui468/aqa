const db = require('./../db/index');

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

    try{
        const client = await db.getClient();

        //check if user has already voted, and update vote if so
        const queryText0 = `
            SELECT * FROM votes 
            WHERE vote_user=$1 AND vote_answer=$2;
        `;
        const votedResult = await client.query(queryText0, [req.user.user_id, req.params.answer_id])
            .catch((err) => {
                client.release();
                throw err;
            });

        if(votedResult.rows.length > 0) { //update previous vote
            const queryText1 = `
                UPDATE votes
                SET vote_answer=$1, vote_date=current_timestamp, vote_user=$2
                WHERE vote_user=$2
            `;
            const updateResult = await client.query(queryText1, [req.params.answer_id, req.user.user_id])
                .catch((err) => {
                    client.release();
                    throw err;
                });
        }else{ //add new vote
            const queryText2 = `
                INSERT INTO votes (vote_date, vote_user, vote_answer)
                VALUES (current_timestamp, $1, $2);
            `;
            const addResult = await client.query(queryText2, [req.user.user_id, req.params.answer_id])
                .catch((err) => {
                    client.release();
                    throw err;
                });
        }

        client.release();

        return res.status(200).json({ message: "Voted for answer" });
    }catch(err){
        return next(err);
    }

};

