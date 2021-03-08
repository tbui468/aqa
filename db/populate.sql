\i ~/Dev/aqa/db/createTables.sql;


/* add dummy user data */
INSERT INTO users (user_name, user_email, user_password) VALUES ('John', 'J@gmail.com', 'password0');
INSERT INTO users (user_name, user_email, user_password) VALUES ('Kappy', 'Kappy@hotmail.com', 'password1');
INSERT INTO users (user_name, user_email, user_password) VALUES ('Pooh', 'Bear@animal.com', 'password2');


/* add dummy question data */
/* for now, manually assign each question a topic: medicine, business or history */
INSERT INTO questions (question_text, question_topic, question_date, question_user) 
              VALUES ('How lethal is covid-19?', 'medicine', current_timestamp, (SELECT user_id FROM users WHERE user_name='John'));
INSERT INTO questions (question_text, question_topic, question_date, question_user) 
              VALUES ('What are the signs of high blood pressure?', 'medicine', current_timestamp, (SELECT user_id FROM users WHERE user_name='John'));
INSERT INTO questions (question_text, question_topic, question_date, question_user) 
              VALUES ('Was Genghis Khan a a serial killer?', 'history', current_timestamp, (SELECT user_id FROM users WHERE user_name='Pooh'));


/* add dummy answer data - only kappy answered  */
INSERT INTO answers (answer_text, answer_date, answer_user, answer_question) 
          VALUES ('Very.  Do not take any risks', current_timestamp, (SELECT user_id FROM users WHERE user_name='Kappy'), (SELECT question_id FROM questions WHERE question_id=1));
INSERT INTO answers (answer_text, answer_date, answer_user, answer_question) 
          VALUES ('To many he was a savior, and to others a murderer', current_timestamp, (SELECT user_id FROM users WHERE user_name='Kappy'), (SELECT question_id FROM questions WHERE question_id=3));
INSERT INTO answers (answer_text, answer_date, answer_user, answer_question) 
          VALUES ('He was.  And a rapist', current_timestamp, (SELECT user_id FROM users WHERE user_name='John'), (SELECT question_id FROM questions WHERE question_id=3));


/* add dummy votes data - John voted for each of kappy's answers*/
INSERT INTO votes (vote_date, vote_user, vote_answer) VALUES (current_timestamp, (SELECT user_id FROM users WHERE user_name='John'), 1); 
INSERT INTO votes (vote_date, vote_user, vote_answer) VALUES (current_timestamp, 1, 2);
INSERT INTO votes (vote_date, vote_user, vote_answer) VALUES (current_timestamp, 3, 3);
INSERT INTO votes (vote_date, vote_user, vote_answer) VALUES (current_timestamp, 2, 3);

