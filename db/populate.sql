\i ~/Dev/aqa/db/createTables.sql;


/* add dummy user data - note: passwords won't be properly hashed, so login will be impossible */
INSERT INTO users 
    (user_name, user_email, user_password)
VALUES
    ('Abel', 'A@gmail.com', 'password0'), /* question asker */
    ('Bob', 'Bear@hotmail.com', 'password1'), /* answerer 1 - good at history*/
    ('Catherine', 'Cathy@animal.com', 'password2'), /* answerer 2 - good at medicine*/
    ('Darcie', 'DD@animal.com', 'password2'), /* Voter 1 */
    ('Eugene', 'Eugene@animal.com', 'password2'), /* Voter 2 */
    ('Fortraine', 'Forty@animal.com', 'password2'), /* Voter 3 */
    ('Grant', 'Granty@animal.com', 'password2'), /* Answerer 3 for Bob and Catherine to vote on */
    ('Heather', 'Heathen@animal.com', 'password2'); /* Answerer 4 for Bob and Catherine to vote on */

/* More dummy users for voting */
INSERT INTO users (user_name, user_email, user_password) VALUES ('Ingrid', 'Ingy@animal.com', 'password2');
INSERT INTO users (user_name, user_email, user_password) VALUES ('Janice', 'Jannnnice@animal.com', 'password2');


/* add dummy question data - note: only Abel asked question for simplicity*/
/* for now, manually assign each question a topic: medicine, business or history */
INSERT INTO questions
    (question_text, question_topic, question_date, question_user) 
VALUES
    ('How lethal is covid-19?', 'Medicine and Healthcare', current_timestamp, (SELECT user_id FROM users WHERE user_name='Abel')),
    ('Was Genghis Khan a good government leader?', 'Law and Government', current_timestamp, (SELECT user_id FROM users WHERE user_name='Abel')),

/* Three questions to test weights of Bob and Catherine */
    ('This is a medical question', 'Medicine and Healthcare', current_timestamp, (SELECT user_id FROM users WHERE user_name='Abel')),
    ('This is a law/governmetn question', 'Law and Government', current_timestamp, (SELECT user_id FROM users WHERE user_name='Abel')),
    ('This is a business question', 'Business and Administration', current_timestamp, (SELECT user_id FROM users WHERE user_name='Abel'));

/* add dummy answer data - Bob's answers */
INSERT INTO answers
    (answer_text, answer_date, answer_user, answer_question) 
VALUES
    ('Very.  Do not take any risks', current_timestamp, 2, (SELECT question_id FROM questions WHERE question_id=1)),
    ('He known as a killer to his enemies, but a great leader to many others', current_timestamp, 2, (SELECT question_id FROM questions WHERE question_id=2)),

/* add dummy answer data - Catherine's answers */
    ('Worst than regular flu, but not as bad as 1918 one.', current_timestamp, 3, (SELECT question_id FROM questions WHERE question_id=1)),
    ('No, he was a terrible leader.  And a rapist', current_timestamp, 3, (SELECT question_id FROM questions WHERE question_id=2)),

/* Grant and Heather's answers to weight testing questions: Bob and Catherine will vote on these */
    ('This Grants answer to the medical question.', current_timestamp, (SELECT user_id FROM users WHERE user_name='Grant'), (SELECT question_id FROM questions WHERE question_id=3)),
    ('This Heathers answer to the medical question.', current_timestamp, (SELECT user_id FROM users WHERE user_name='Heather'), (SELECT question_id FROM questions WHERE question_id=3)),
    ('This Grants answer to the history question.', current_timestamp, (SELECT user_id FROM users WHERE user_name='Grant'), (SELECT question_id FROM questions WHERE question_id=4)),
    ('This Heathers answer to the history question.', current_timestamp, (SELECT user_id FROM users WHERE user_name='Heather'), (SELECT question_id FROM questions WHERE question_id=4)),
    ('This Grants answer to the business question.', current_timestamp, (SELECT user_id FROM users WHERE user_name='Grant'), (SELECT question_id FROM questions WHERE question_id=5)),
    ('This Heathers answer to the business question.', current_timestamp, (SELECT user_id FROM users WHERE user_name='Heather'), (SELECT question_id FROM questions WHERE question_id=5));


/* add dummy votes data - Darcie, Eugene and Fortraine vote for one answer for each of the three questions */
/* answer 1 and 2 are Bob's (medical and history), 3 and 4 are Catherine's (medical and history) */
/* everyone votes for Catherines medical answer */
/* two votes for Bob's history answer, and 1 for Catherine's history answer */
/* Catherine has 105 medical, 101 history, 100 business.  Bob has 100 medical, 104 history, 100 business */
INSERT INTO votes 
    (vote_date, vote_user, vote_answer)
VALUES
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Darcie'), 3),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Darcie'), 2),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Eugene'), 3),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Eugene'), 2), 
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Fortraine'), 3), 
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Fortraine'), 4), 
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Ingrid'), 3),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Ingrid'), 2), 
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Janice'), 3), 
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Janice'), 2),
/* Add dummy votes for Bob and Catherine to test the weighted vote system */
/* 5, 7, 9 are Grant's answers to medical, history and business.  6, 8, 10 are Heather's answers to medical, history, and business */
/* Medical: Grant's answer should have 100/205, and Heather's answer 105/205*/
/* History:  Grant's answer should have 104/205 and Heather's answer 101/205 */
/* Business:  Grant's answer should have 100/200 and Heather's answer 100/200 */
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Bob'), 5),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Catherine'), 6),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Bob'), 7),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Catherine'), 8),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Bob'), 9),
    (current_timestamp, (SELECT user_id FROM users WHERE user_name='Catherine'), 10);
