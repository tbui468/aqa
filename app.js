//main
const express = require('express');
const session = require('express-session'); 
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy; 
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const db = require('./db/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');

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


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors({ credentials: true, origin: true }));
/*
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //let any anyone connect
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, set-cookie');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});*/

// routes
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/questions', answersRouter);

/*
app.get('/profile', (req, res, next) => {
    //const sessionCookie = req.cookies['connect.sid'];
    //console.log(sessionCookie);
    if(!req.user) {
        return res.status(404).json({ message: "Log in to access the profile page" });
    }else{
        return res.status(200).json(req.user);
    }
});*/

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
