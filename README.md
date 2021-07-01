# aqa
Anonymous question and answer (AQA) board.  As users vote for your answers for a given topic, you get more points in that topic.  Any votes you make in that given topic are now worth more since you are considered an expert.

Written in ExpressJS, Postgresql, and Nodejs.  

The backend for 'aqa-frontend', and 'aqa-neuralnetwork' (which uses simple word vectors to attempt to classify a question by topic).

Main components:\n

'app.js' is the main entry point.  Calls any necessary middleware.\n
'db' contains code to initiate postgresql.\n
'models' contains code for the database models of questions, answers, users and votes.
'routes' contains the RESTFUL routes.  The routes calls on any required services, and returns a json object for use by frontend.
'services' contains code for accessing the database or outside services (such as 'aqa-neuralnetwork').
