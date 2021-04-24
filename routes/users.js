//Router handles GET,PUT,POST,DELETE endpoints for login,signup,or logout for users
const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//Endpoint allows new user to register on our site
router.post('/signup', (req, res) => {
    User.register(//Adding new user to the USER model
        new User({username: req.body.username}),//New user created with name given by client
        req.body.password,//PW from client
        err => {//Callback method with error that shows server issue
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});//explains error
            } else {//authenticates newly registered user
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
});

//Endpoint allows user to log-in to site
//Enables Passport authentication on this route, passport authenticate handles logging in the user(challenging etc.)
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});//Response to client
});



//Endpoint allows user to log-out of site
router.get('/logout', (req, res, next) => {
    if (req.session) {//Checks first if session exists
        req.session.destroy();//Deletes the session file on server side
        res.clearCookie('session-id');//clears the cookie thats been stored on the client side
        res.redirect('/');//redirects to the home
    } else {
        const err = new Error('You are not logged in!');//IF session doesnt exist, tell user that they are not logged in
        err.status = 401;
        return next(err);
    }
});

module.exports = router;