const db = require('./../db/index');


exports.user_list = function(req, res, next) {
  db.query('SELECT * FROM users ORDER BY user_id ASC', [], (err, results) => {
    if(err) {
      return next(err);
    }
    res.status(200).json(results.rows);
  });
}
