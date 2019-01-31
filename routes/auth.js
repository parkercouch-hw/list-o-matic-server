require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');
const serverError = require('../utils/errors');

// POST /auth/login route - returns a JWT
router.post('/login', async (req, res, next) => {
  try {
    const user = await db.User.findOne({ email: req.body.email });

    if (!user || !user.password) {
      return next(new serverError(400, 'User not found'));
    }

    const authorized = await user.isAuthenticated(req.body.password);

    if (!authorized){
      return next(new serverError(401, 'Invalid Credentials'));
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    return res.send({ token });
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', async (req, res, next) => {
  try {
    const existingUser = await db.User.findOne({ email: req.body.email });

    if (existingUser) {
      return next(new serverError(409, 'User exists already'));
    }

    const newUser = await db.User.create(req.body)

    const token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    return res.send({ token });
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

// This is what is returned when client queries for new user data
router.post('/current/user', async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).send({ user: null});
  } 

  try {
    const user = await db.User.findById(req.user.id);

    if (!user) {
      return res.status(401).send({ user: null});
    }

    return res.send({ user });
    
  } catch (error) {
    return next(new serverError(403, 'Database Error', error));
  }
});

module.exports = router;
