const router = require('express').Router();

//@temp: both of these should NOT be accessible by users without valid tokens

router.get('/', (req, res, next) => {
  return res.json({ message: 'You have access to a private GET route!'});
});
router.post('/profile', (req, res, next) => {
  return res.json({ message: 'You have access to a private POST route!'});
});

module.exports = router;
