const express = require('express');
const router = express.Router();
const serverError = require('../utils/errors');

Lists = require('../models/list');

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
    return next(new serverError(403, 'Database Error', error));
  }
});

/* POST /lists -- find all user's lists */
router.post('/', async (req, res, next) => {
  try {
    const userLists = await Lists.find({ creatorId: req.body.userId });

    return res.send(userLists);
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

module.exports = router;