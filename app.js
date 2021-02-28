//finish controller for question_detail
//  currently just pulling question/users info
//  should use question details to find list of corresponding answers AND the author of the question

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const db = require('./db/index');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');

const port = process.env.PORT || 3000;
const app = express();

//set passport strategy

passport.use(
  new LocalStrategy((username, password, done) => {
    const results = db.query('SELECT * FROM users WHERE user_name=$1;', [username]);
    results.then(function(result) {
      if(result.rows  === undefined || result.rows.length === 0) {
        return done(null, false, { message: 'Username not found' });
      }else{
        bcrypt.compare(password, result.rows[0].user_password, function(err, res) {
          if(res) {
            return done(null, result.rows[0], { message: 'User found in DB' });
          }else{
            return done(null, false, { message: 'Incorrect password' });
          }
        });
      }
    }).catch(function(err) {
      return done(err, null, { message: 'Error connecting to database' });
    });
  })
);

//serializeUser - this function takes user object (row in our db) and sets it to req.session.passport.user
passport.serializeUser(function(user, done) {
  console.log('hi');
  console.log(user.user_id);
  done(null, user.user_id, { message: 'User serialized' });
});

//deserializeUser - this function takes req.session.passport.user and deserializes it, then sets req.user to it.  (that's why res.locals.currentUser = req.user works)
passport.deserializeUser(function(id, done) {
  console.log(id);
  const results = db.query('SELECT * FROM users WHERE user_id=$1;', [id]);
  results.then(function(result) {
    if(result.rows === undefined || result.rows.length === 0) {
      done(null, false, { message: 'session user id not found in database' });
    }else{
      done(null, result.rows[0]);
    }
  }).catch(function(err) {
    done(err);
  });
});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


///////////temp testing sessions////////////
app.get('/currentUser', (req, res, next) => {
  if(req.user) {
    return res.json({message: req.user.user_name + ' is logged in'});
  }else{
    return res.json({ message: 'No user currently logged in' });
  }
});

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);

app.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});



//handle errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('shit broke');
});

app.listen(port, function() {
  console.log(`App is listening on port: ${port}`);
});

