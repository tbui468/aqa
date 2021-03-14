//could start replacing third party middleware with my own middleware (to learn and for ownership over more of the system)
    //express-validator - could replace with own middleware (fourth)

const express = require('express');
const session = require('express-session'); //could replace with this with own middleware (third)
const passport = require('passport'); //could replace with with my own middleware (first)
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy; //could replace this with my own middleware (first)
const helmet = require('helmet');
const compression = require('compression');

require('dotenv').config(); //replace with my own stuff

const db = require('./db/index');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');
const votesRouter = require('./routes/votes');

const port = process.env.PORT;
const app = express();

// set passport strategy
passport.use('my-strategy',
    new LocalStrategy( async (username, password, done) => {
        try{
            const result = await db.query('SELECT * FROM users WHERE user_name=$1;', [username,]);
            if (result.rows === undefined || result.rows.length === 0) {
                return done(null, false, { message: 'Username not found' });
            }
            bcrypt.compare(password, result.rows[0].user_password, (err, res) => {
                if (res) {
                    return done(null, result.rows[0], { message: 'User found in DB' });
                }
                return done(null, false, { message: 'Incorrect password' });
            });
        }catch(err){
            done(err, null, { message: 'Error connecting to database' })
        }
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const result = await db.query("SELECT * FROM users WHERE user_id=$1;", [id]);
        if(result.rows === undefined || result.rows.length === 0) {
            done(null, false);
        }else{
            done(null, result.rows[0]);
        }
    }catch(err){
        done(err);
    }
});

const cors = (req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
    });
    next();
}

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(helmet());
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});*/

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/questions', answersRouter);
app.use('/votes', votesRouter);

app.get('/profile', (req, res, next) => {
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the profile page" });
    }else{
        return res.status(200).json(req.user);
    }
});

app.post('/login', [passport.authenticate('my-strategy'), 
    (req, res, next) => {
        return res.status(200).json({message: "Successfully logged in"});
    }
]);

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
