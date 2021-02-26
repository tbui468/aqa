const db = require('./../db/index');

exports.question_list = function(req, res, next) {
  let promise = db.query('SELECT * FROM questions ORDER BY question_date ASC;');
  promise.then(function(result) {
    res.status(200).json(result.rows);
  }).catch(function(err) {
    return next(err);
  }).finally(function() {
    //do nothing for now
  });
}

exports.question_detail = async function(req, res, next) {
  const client = await db.getClient();

  const p0 = await client.query('SELECT * FROM questions WHERE question_id=$1;', [req.params.id]);
  const user_id = p0.rows[0].question_user;

  const p1 = await client.query('SELECT * FROM users WHERE user_id=$1;', [user_id]);

  const p3 = await client.query('SELECT * FROM answers WHERE answer_question=$1;', [req.params.id]);

  client.release();

  let obj = {
    question: p0.rows,
    author: p1.rows,
    answers: p3.rows
  }

  res.status(200).json(obj);
}
