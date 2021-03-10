
exports.index = function(req, res, next) {
  return res.status(200).json({ info: 'Main page' });
}
