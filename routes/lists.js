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

    const newList = await db.List.create({
      name: req.body.name,
      key: listKey,
      creatorId: req.body.userId,
      items: [],
    });

    await db.User.updateOne({
      _id: req.body.userId,
    },{
      $push: {"lists": newList._id},
    });

    return res.send({ listKey });
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

/* POST /lists/join -- add list to user's lists */
router.post('/join', async(req, res, next) => {
  try {
    const list = await db.List.findOne({
      key: req.body.key,
    });

    if (!list) {
      return next(new serverError(404, 'No list found', error));
    }

    await db.User.updateOne({
      _id: req.body.userId,
    },{
      $push: {"lists": list._id},
    });

    return res.send({ list });
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

/* POST /lists -- find all user's lists */
router.post('/', async (req, res, next) => {
  try {
    const usersLists = await db.User.findById(req.body.userId).populate('lists');

    return res.send(usersLists.lists);
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

/* POST /lists -- find all user's lists */
router.post('/addItem', async (req, res, next) => {
  const newItem = {
    content: req.body.content,
    posterId: req.body.userId,
    completed: false,
  };

  try {

    await db.List.updateOne({
      _id: req.body.listId,
    },{
      $push: {"items": newItem},
    });

    return res.send('Added!');
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

module.exports = router;