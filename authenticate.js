//Passport Middleware
const passport = require('passport');
//Passport Local Strategy
const LocalStrategy = require('passport-local').Strategy;
//User model, has access to passport-local-mongoose plugin
const User = require('./models/user');

//Adds the specific strategy plugin that we wish to use to our passport implementation
//Localstrategy instance reqs. verified callback fn;fn that verifies username/pw against local stored username/pw;
//authenticate method provided by passportlocalmongoose, method on the USER model
//IF passportlocalmongoose plugin not used, we would need to supply another verification fn here(another plugin or ourself)
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//Whenever sessions are used with passport, you need to serialize then deserialize the user instance
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());