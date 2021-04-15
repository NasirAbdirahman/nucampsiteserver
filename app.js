//* Main Code for the Server*//

var createError = require('http-errors');
var express = require('express');
var path = require('path');

// Middleware Libraries
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Creates a New express Application, under the name 'app'
var app = express();

// view engine setup, Created Jade View Template Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Methods equipe the app with all the middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//Built in middleware that serves static files

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
