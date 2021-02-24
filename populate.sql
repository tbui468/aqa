DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

/* create users table */

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  user_name TEXT,
  user_email TEXT,
  user_weight INTEGER
);

/* add dummy user data */
INSERT INTO users (user_name, user_email, user_weight) VALUES ('John', 'J@gmail.com', 1);
INSERT INTO users (user_name, user_email, user_weight) VALUES ('Kappy', 'Kappy@hotmail.com', 2);
INSERT INTO users (user_name, user_email, user_weight) VALUES ('Pooh', 'Bear@animal.com', 1);


/* create questions table */
CREATE TABLE questions(
  question_id SERIAL PRIMARY KEY,
  question_text TEXT,
  question_date DATE,
  question_user INTEGER REFERENCES users (user_id)
);
/* add dummy question data */
INSERT INTO questions (question_text, question_date, question_user) 
              VALUES ('Are birds real?', current_timestamp, (SELECT user_id FROM users WHERE user_name='John'));
INSERT INTO questions (question_text, question_date, question_user) 
              VALUES ('Are zebras real too?', current_timestamp, (SELECT user_id FROM users WHERE user_name='John'));
INSERT INTO questions (question_text, question_date, question_user) 
              VALUES ('Where the honey at?', current_timestamp, (SELECT user_id FROM users WHERE user_name='Pooh'));

/* create answers table */
CREATE TABLE answers(
  answer_id SERIAL PRIMARY KEY,
  answer_text TEXT,
  answer_date DATE,
  answer_user INTEGER REFERENCES users (user_id),
  answer_question INTEGER REFERENCES questions (question_id)
);

/* add dummy answer data - only kappy answered  */
INSERT INTO answers (answer_text, answer_date, answer_user, answer_question) 
          VALUES ('No, birds are part of the simulation', current_timestamp, (SELECT user_id FROM users WHERE user_name='Kappy'), (SELECT question_id FROM questions WHERE question_id=1));
INSERT INTO answers (answer_text, answer_date, answer_user, answer_question) 
          VALUES ('There is no honey', current_timestamp, (SELECT user_id FROM users WHERE user_name='Kappy'), (SELECT question_id FROM questions WHERE question_id=3));

/* create votes table */
CREATE TABLE votes(
  vote_id SERIAL PRIMARY KEY,
  vote_date DATE,
  vote_user INTEGER REFERENCES users (user_id),
  vote_answer INTEGER REFERENCES answers (answer_id)
);
/* add dummy votes data - John voted for each of kappy's answers*/
INSERT INTO votes (vote_date, vote_user, vote_answer) VALUES (current_timestamp, (SELECT user_id FROM users WHERE user_name='John'), 1); 
INSERT INTO votes (vote_date, vote_user, vote_answer) VALUES (current_timestamp, 1, 2);





