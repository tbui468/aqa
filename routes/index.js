const router = require('express').Router();
const indexController = require('./../controllers/index');

router.get('/', indexController.index);
//testing other methods
router.post('/', (req, res, next) => {
  return res.send('received a POST http method');
});
router.put('/', (req, res, next) => {
  return res.send('received a PUT http method');
});
router.delete('/', (req, res, next) => {
  return res.send('received a DELETE http method');
});

module.exports = router;
