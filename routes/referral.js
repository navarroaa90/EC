var express = require('express');
var router = express.Router();

/* GET About Me page. */
router.get('/', function(req, res, next) {
  res.render('referral', { title: 'Referral' });
});

module.exports = router;