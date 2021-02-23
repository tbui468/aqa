//skim odin NodeJS sections on authentication/APIs to have a vague idea on how to structure project

//see how local_library handled errors - test with my app (current error is 'cannot GET wrongroute')

//get local database serving json (views will be taken care of by react front end)
  //use the current users table to test controller/routes/app 

//should make new project for postgres (user and role??)
//  call it aqa

//MODELS
//  write script to just add tables into postgress (if they already don't exist - need a way to check if table exists)
//    this should not include any entries, just the tables
//    User (id, name, email)
//    Post (id, user ref, date, title, contents)
//  Write script to add test entries into tables (once again, making sure those tables already exist)

const express = require('express');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const port = process.env.PORT || 3000;
const app = express();


//middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(port, function() {
  console.log(`App is listening on port: ${port}`);
});

