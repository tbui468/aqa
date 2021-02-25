const db = require('./../db/index');

exports.user_list = function(req, res, next) {
  let promise = db.query('SELECT * FROM users ORDER BY user_id ASC;');
  promise.then(function(result) {
    res.status(200).json(result.rows);
  }).catch(function(err) {
    return next(err);
  }).finally(function() {
    //do nothing for now
  });
}

exports.user_detail = function(req, res, next) {
  let promise = db.query('SELECT * FROM users WHERE user_id=$1;', [req.params.id]);
  promise.then(function(result) {
    res.status(200).json({...result.rows, ...result.rows});
  }).catch(function(err) {
    return next(err);
  }).finally(function() {
    //do nothing for now
  });
}
