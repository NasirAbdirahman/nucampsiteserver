//* Main Code for the Express Server*//

var createError = require('http-errors');
var express = require('express');
var path = require('path');

// Middleware Libraries
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//Connecting to The MongoDb Server//
const mongoose = require('mongoose');
//Url to MongoDb Server
const url = 'mongodb://localhost:27017/nucampsite';
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

// view engine setup, Created Jade View Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//App.use Methods equips the app with all the middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));//Random secutiry key passed in

//Authentication Added here-b/c this is first of middleware Fn that send things back to client
//So users must authenticate before they access data from the server
function auth(req, res, next) {
  if (!req.signedCookies.user) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }

      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const user = auth[0];
      const pass = auth[1];
      if (user === 'admin' && pass === 'password') {
          res.cookie('user', 'admin', {signed: true});//Cookie setup-creates a new cookie, 1st arg(name=user), 2nd arg(val. stored in name prop.=admin);signed lets express know to use the secret key from cookie-parser to create signed cookie
          return next(); // authorized
      } else {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }
  } else {
      if (req.signedCookies.user === 'admin') {
          return next();
      } else {
          const err = new Error('You are not authenticated!');
          err.status = 401;
          return next(err);
      }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));//Built in middleware that serves static files

//App using the Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

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
