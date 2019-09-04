var express = require('express');
var router = express.Router();

const notify = require('../lib/notify')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
