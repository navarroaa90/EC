var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('chair', { title: 'EC Restraining Chair' });
});

module.exports = router;