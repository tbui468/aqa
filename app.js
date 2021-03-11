//could start replacing third party middleware with my own middleware (to learn and for ownership over more of the system)
    //express-validator - could replace with own middleware (fourth)

const express = require('express');
const session = require('express-session'); //could replace with this with own middleware (third)
const passport = require('passport'); //could replace with with my own middleware (first)
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy; //could replace this with my own middleware (first)
const cors = require('cors'); //could replace this with my own middleware (second)
const helmet = require('helmet');
const compression = require('compression');

require('dotenv').config();

const db = require('./db/index');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');

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
    credentials: true,
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

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter); //users/:user_id/answers - all answers belonging to user.  include /:answer_id to get specific question
app.use('/questions', questionsRouter); //questions/:question_id/answers - all answers belonging to question.  Include /:answer_id to get specific answer
app.use('/questions', answersRouter);


app.get('/profile', (req, res, next) => {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the profile page" });
    }else{
        // res.redirect('/users/' + req.user.user_id);
        return res.status(200).json(req.user);
    }
});

app.post('/login', [passport.authenticate('local'), 
    (req, res, next) => {
        return res.status(200).json({message: "Successfully logged in"});
    }
]);

//@temp: move to separate router/controller files
app.get('/logout', (req, res) => {
    req.logout();
    return res.status(200).json({ message: "Successfully logged out" });
});

// handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('shit broke');
});

app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
});
