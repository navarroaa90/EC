var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('immobilizer', { title: 'EC Immobilizer' });
});

module.exports = router;