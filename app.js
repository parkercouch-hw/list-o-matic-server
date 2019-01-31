require('dotenv').config();

const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const expressJwt = require('express-jwt');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Helper function: This allows our server to parse the incoming token from the client
// This is being run as middleware, so it has access to the incoming request
function fromRequest(req){
  if(req.body.headers.Authorization &&
    req.body.headers.Authorization.split(' ')[0] === 'Bearer'){
    return req.body.headers.Authorization.split(' ')[1];
  }
  return null;
}

app.use('/', indexRouter);
app.use('/auth', 
  expressJwt({
    secret: process.env.JWT_SECRET,
    getToken: fromRequest,
  }).unless({
    path: [
      { url: '/auth/login', methods: ['POST'] }, 
      { url: '/auth/signup', methods: ['POST'] }
    ],
  }),
  authRouter,
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Only provide stack trace in development
  const error = req.app.get('env') === 'development'
    ? 
      { message: err.message, stack: err.stack, error: err.error }
    :
      { message: err.message };
  
  if (req.app.get('env') === 'development'){
    console.log('*********************ERROR********************')
    console.log(err.error)
  }

  // console.log(err);

  // send error
  res.status(err.status || 500);
  res.send({ ...error });
});

module.exports = app;
