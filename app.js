// need to integrate JWT (and remove sessions)
//    test JWT with /private routes (both GET and POST)

const express = require('express');
const session = require('express-session'); //@remove after tokens are functional
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
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

passport.use(
  new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }, function(jwtPayload, done) {
    const results = db.query('SELECT * FROM users WHERE user_id=$1', [jwtPayload.user_id]);
    return results
    .then((result) => {
      done(null, result.rows[0]);
    }).catch((err) => {
      done(err, null);
    });
  })
);

const corsOptions = {
  // origin: 'https://vigorous-kare-2dfaa2.netlify.app',
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
};

app.use(passport.initialize());
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
app.get('/currentUser', (req, res) => {
  if (req.user) {
    return res.json({ message: `${req.user.user_name} is logged in` });
  }
  return res.json({ message: 'No user currently logged in' });
});

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
// @temp: should only be accessible by users with valid tokens
app.use('/private', passport.authenticate('jwt', { session: false }), privateRouter); 

//need custom authentication here to make use of JWT strategy
//@temp: move to separate router/controller files

app.post('/login', function(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if(err || !user) {
      return res.status(400).json({
        message: 'Error trying to login',
        user: user,
        info: info
      });
    }else{
      req.login(user, { session: false }, (err) => {
        if(err) { res.send(err); }
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 120 });
        return res.json({ token: token });
      });
    }
  })(req, res, next);
});

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
