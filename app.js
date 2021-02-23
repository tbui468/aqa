//seprate routes and controllers into own files

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

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res, next) {
  res.json({ info: 'aqa app' });
});

app.listen(port, function() {
  console.log(`App is listening on port: ${port}`);
});

