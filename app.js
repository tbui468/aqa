//finish controller for question_detail
//  currently just pulling question/users info
//  should use question details to find list of corresponding answers AND the author of the question

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');


const port = process.env.PORT || 3000;
const app = express();

//set passport strategy
/*
passport.use(
  new LocalStrategy((username, password, done) => {
    //do whatever I need with username and password (such as using bcrypt.compare)
    //and then call done when finished.  If successful, be sure to pass user rows[0] to done() too (should never be more than one row)
    //done(err, user (false if not valid), message)
    //if err, return done(err)
    //if no matchin username or password is wrong, return done(null, false) - first parameter is err (not used here) and optional 3rd parameter for message
    //if okay, return done(null, user) - first parameter is null, and optonal 3rd parameter is message
  });
);*/

//serializeUser - this function takes user object (row in our db) and sets it to req.session.passport.user
//deserializeUser - this function takes req.session.passport.user and deserializes it, then sets req.user to it.  (that's why res.locals.currentUser = req.user works)
//set passport/session as middleware

//middleware (all requests pass through these middleware before getting to the routes)
//app.use(A //init express-session
  //init passport (using strategy specified above) note: this is called on every request
  //connect passport with session
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//optional: set res.locals.currentUser = req.user so that all routes down below have access to res.locals.currentUser (which will be null is no one is logged in)

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
/*
app.use('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
  });
);
app.use('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});*/

//handle errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('shit broke');
});

app.listen(port, function() {
  console.log(`App is listening on port: ${port}`);
});

