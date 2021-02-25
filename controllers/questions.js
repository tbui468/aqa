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

exports.question_detail = function(req, res, next) {
  let promise = db.query('SELECT * FROM questions WHERE question_id=$1;', [req.params.id]);
  /*
  let a = 0;
  let b = 0;
  promise.then(function(result) {
  //  res.status(200).json(result.rows);
    a = result.rows;
  }).catch(function(err) {
    return next(err);
  }).finally(function() {
    //do nothing for now
  });*/

  let promise1 = db.query('SELECT * FROM users;');
 /* 
  promise1.then(function(result) {
   // res.status(200).json(result.rows);
    b = result.rows;
  }).catch(function(err) {
    return next(err);
  }).finally(function() {
    //do nothing for now
  });*/

  //using same keys, so overwriting
  Promise.all([promise, promise1]).then((values) => {
    let obj = {
      a: values[0].rows,
      b: values[1].rows
    }
    res.status(200).json(obj);
  }).catch(function(err) {
    return next(err);
  });
}
