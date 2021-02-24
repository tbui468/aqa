DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;

/* create users table */

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30),
  weight INTEGER
);

/* add dummy user data */
INSERT INTO users (name, email, weight) VALUES ('John', 'J@gmail.com', 1), ('Kappy', 'Kappy@hotmail.com', 2),('Pooh', 'Bear@animal.com', 1);
INSERT INTO users (name, email, weight) VALUES ('John', 'J@gmail.com', 1), ('Kappy', 'Kappy@hotmail.com', 2),('Pooh', 'Bear@animal.com', 1);


/* create questions table */
/* add dummy question data */

/* create answers table */
/* add dummy answer data */
