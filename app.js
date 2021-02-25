

const express = require('express');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');

const port = process.env.PORT || 3000;
const app = express();


//middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);

//handle errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('shit broke');
});

app.listen(port, function() {
  console.log(`App is listening on port: ${port}`);
});

