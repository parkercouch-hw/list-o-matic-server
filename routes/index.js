var express = require('express');
var router = express.Router();
const serverError = require('../utils/errors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('home');
});


module.exports = router;
