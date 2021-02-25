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
  const p1 = await client.query('SELECT * FROM users;');

  client.release();

  let obj = {
    a: p0.rows,
    b: p1.rows
  }

  res.status(200).json(obj);

  /*
  Promise.all([p0, p1])
    .then((values) => {
      let obj = {
        a: values[0].rows,
        b: values[1].rows
      }
      res.status(200).json(obj);
    }).catch((errs) => {
      return next(errs[0] + errs[1]);
    });*/


  /*

  let promise = db.query('SELECT * FROM questions WHERE question_id=$1;', [req.params.id]);
  let promise1 = db.query('SELECT * FROM users;');

//using same keys, so overwriting
  Promise.all([promise, promise1]).then((values) => {
    let obj = {
      a: values[0].rows,
      b: values[1].rows
    }
    res.status(200).json(obj);
  }).catch(function(err) {
    return next(err);
  });*/
}
