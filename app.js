//convert back to session, since JWT introduces too much complexity for scalability that's not needed

const express = require('express');
const session = require('express-session'); //@remove after tokens are functional
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

require('dotenv').config();

const db = require('./db/index');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const privateRouter = require('./routes/private'); //@temp

const port = process.env.PORT;
const app = express();

// set passport strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    const results = db.query('SELECT * FROM users WHERE user_name=$1;', [
      username,
    ]);
    results
      .then((result) => {
        if (result.rows === undefined || result.rows.length === 0) {
          return done(null, false, { message: 'Username not found' });
        }
        bcrypt.compare(password, result.rows[0].user_password, (err, res) => {
          if (res) {
            return done(null, result.rows[0], { message: 'User found in DB' });
          }
          return done(null, false, { message: 'Incorrect password' });
        });
      })
      .catch((err) => done(err, null, { message: 'Error connecting to database' }));
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  const results = db.query("SELECT * FROM users WHERE user_id=$1;", [id]);
  results
  .then((result) => {
    if(result.rows === undefined || result.rows.length === 0) {
      done(null, false);
    }else{
      done(null, result.rows[0]);
    }
  }).catch((err) => {
    done(err);
  });
});

const corsOptions = {
  // origin: 'https://vigorous-kare-2dfaa2.netlify.app',
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
};

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//@temp: move to separate router/controller files
app.get('/private', (req, res) => {
  if (req.user) {
    return res.json({ message: "hello logged in user!" });
  }
  return res.json({ message: 'you CAN NOT access this route' });
});

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
// @temp: should only be accessible by users with valid tokens
//app.use('/private', passport.authenticate('local'), privateRouter); 


app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
  })
);

//@temp: move to separate router/controller files
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// handle errors
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('shit broke');
});

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
