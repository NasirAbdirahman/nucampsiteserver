//* Main Code for the Express Server*//

var createError = require('http-errors');
var express = require('express');
var path = require('path');

// Middleware Libraries
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);//Immediately calls the session

const passport = require('passport');
const authenticate = require('./authenticate');

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
//app.use(cookieParser('12345-67890-09876-54321'));//Random secutiry key passed in
app.use(session({
  name: 'session-id',//Doesnt matter what you put here
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,//new session created but no updates, it wont get saved b/c it was an empty session, so no cookie sent to client
  resave: false,//once session created/updated and saved, will continue to be resaved everytime a req. is made for that session, keeps session marked as 'active'
  store: new FileStore()//creates new filestore as object,we can use to save our session info to servers harddisk, instead of just in running apps. memory
}));

//Only necessary if we using session-based authentication; middleware fn provided by passport to check if session exists for client
//If so, then its loaded for the client as req.user
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);

//Users can access user router before they are challenged to authenticate themselves (So they can now create an account)
//Authentication Added here-b/c this is first of middleware Fn that send things back to client
function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
      const err = new Error('You are not authenticated!');                    
      err.status = 401;
      return next(err);
  } else {
      return next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));//Built in middleware that serves static files

//App using the Routers
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
