const express = require('express');
const router = express.Router();
const serverError = require('../utils/errors');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('home');
});


module.exports = router;
