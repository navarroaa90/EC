var express = require('express');
var router = express.Router();

/* GET About Me page. */
router.get('/', function(req, res, next) {
  res.render('aboutme', { title: 'About Me' });
});

module.exports = router;