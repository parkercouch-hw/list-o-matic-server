const express = require('express');
const router = express.Router();
const serverError = require('../utils/errors');

// NanoId -- with bad word filter
const en = require("nanoid-good/locale/en");
const nanoid = require("nanoid-good")(en);

/* GET /lists/new -- generate new List */
router.get('/new', async (req, res, next) => {
  try {
    const listKey = await nanoid();

    // TODO: Add to DB and add to User's lists

    return res.send({ listKey });
  } catch (error) {
    return next(new serverError(401, 'Database Error', error));
  }
});


module.exports = router;