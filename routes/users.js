const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//Endpoint allows new user to register on our site
router.post('/signup', (req, res, next) => {
    User.findOne({username: req.body.username})//First check if username already exists
    .then(user => {
        if (user) {
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else { //Not found, new user can be created
            User.create({
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

//Endpoint allows user to log-in to site
router.post('/login', (req, res, next) => {
    if(!req.session.user) { 
        const authHeader = req.headers.authorization;

        if (!authHeader) { //User is NOT logged in
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
      
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      
        User.findOne({username: username})//Checks the username/PW client is sending w/ our DB
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist!`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {
                const err = new Error('Your password is incorrect!');
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) {//if username/PW is correct
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));
    } else {//user is logged in already
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
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