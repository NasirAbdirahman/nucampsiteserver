//Passport Middleware
//LEFT LOCALSTRATEGY; USING IT TOGETHER WITH JSWT STRATEGY
const passport = require('passport');

//Passport Local Strategy
const LocalStrategy = require('passport-local').Strategy;
//User model, has access to passport-local-mongoose plugin
const User = require('./models/user');

//JWT strategy imports
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;//Provides helper methods
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');//Config file

//Adds the specific strategy plugin that we wish to use to our passport implementation
//Localstrategy instance reqs. verified callback fn;fn that verifies username/pw against local stored username/pw;
//authenticate method provided by passportlocalmongoose, method on the USER model
//IF passportlocalmongoose plugin not used, we would need to supply another verification fn here(another plugin or ourself)
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//Whenever sessions are used with passport, you need to serialize then deserialize the user instance
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Contains ID for USER Doc
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});//returns token with user obj.,secretKey and expiration
};//USe 48 hrs in real app, NEVER OMIT EXPIRATION

//Configured JWT strategy for passport
const opts = {};//Contains options for JWT strategy; 2 props. below that configure it
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//Option specifies how JWT should be extracted from incoming req. message(Token should be in Header & Bearer token); simplest method to sending a JWT
opts.secretOrKey = config.secretKey;//OPtion lets us apply JWT strategy w/ key that signs token

//Export JWT strategy
exports.jwtPassport = passport.use(
    new JwtStrategy(//JWT constructor w/ 2 args.
        opts,//Configuration options
        (jwt_payload, done) => {//verified callback Fn. from Docs.
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }//Can create prompt to create a new USer acct. here
            });
        }
    )
);

//Verifies incoming req. is from an auth. user
exports.verifyUser = passport.authenticate('jwt', {session: false});//Using jwt strategy & not sessions 