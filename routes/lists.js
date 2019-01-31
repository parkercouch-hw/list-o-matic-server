const express = require('express');
const router = express.Router();
const serverError = require('../utils/errors');

const db = require('../models');

// NanoId -- with bad word filter
const en = require("nanoid-good/locale/en");
const nanoid = require("nanoid-good")(en);

/* GET /lists/new -- generate new List */
router.post('/new', async (req, res, next) => {
  try {
    const listKey = await nanoid();

    const newList = db.List.create({
      name: req.body.name,
      key: listKey,
      creatorId: req.body.userId,
      items: [],
    });

    db.User.updateOne({
      _id: req.body.userId,
    },{
      $push: {"lists": newList._id},
    });

    return res.send({ listKey });
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

/* POST /lists -- find all user's lists */
router.post('/', async (req, res, next) => {
  try {
    const userLists = await db.List.find({ creatorId: req.body.userId });

    return res.send(userLists);
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

module.exports = router;