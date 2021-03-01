DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  user_name TEXT,
  user_email TEXT,
  user_password TEXT,
  user_weight INTEGER
);

CREATE TABLE questions(
  question_id SERIAL PRIMARY KEY,
  question_text TEXT,
  question_date DATE,
  question_user INTEGER REFERENCES users (user_id)
);

CREATE TABLE answers(
  answer_id SERIAL PRIMARY KEY,
  answer_text TEXT,
  answer_date DATE,
  answer_user INTEGER REFERENCES users (user_id),
  answer_question INTEGER REFERENCES questions (question_id)
);

CREATE TABLE votes(
  vote_id SERIAL PRIMARY KEY,
  vote_date DATE,
  vote_user INTEGER REFERENCES users (user_id),
  vote_answer INTEGER REFERENCES answers (answer_id)
);