//* Main Code for the Express Server*//

var createError = require('http-errors');
var express = require('express');
var path = require('path');

// Middleware Libraries
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');

//Connecting to The MongoDb Server//
const mongoose = require('mongoose');

//Url to MongoDb Server in config.js
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

//Creates a New express Application, under the name 'app'
var app = express();

// Secure traffic only
//Routing method that catches all req to server, then redirects to https, if from http
app.all('*', (req, res, next) => {// * = wildcard(cataches all)
  if (req.secure) {//checking if it is https; secure automatically set to true by express
    return next();
  } else {//If not secure, redirect to https
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);//301 = permanent redirect
  }
});


// view engine setup, Created Jade View Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//App.use Methods equips the app with all the middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Only necessary if we using session-based authentication; middleware fn provided by passport to check if session exists for client
//If so, then its loaded for the client as req.user
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));//Built in middleware that serves static files

//App using the Routers with specific paths
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
