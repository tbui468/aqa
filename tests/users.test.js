//testing users routes and controller based off default populate.sql default values
//IF populate.sql is changed, these test may fail!! So change tests along with populate.sql


const express = require('express');
const request = require('supertest');
const usersRouter = require('./../routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', usersRouter);

describe('/users GET', () => {
    it('users index count', async (done) => {
        try{
            const res = await request(app)
                .get('/users')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(10);
            return done();
        }catch(err){
            return done(err);
        }
    });
});


describe('creating new user', () => {
    it('/users POST', async (done) => {
        try{
            const res = await request(app)
                .post('/users')
                .send({ username: 'testuser', email: 'test@email.com', password: 'testpassword' });

            expect(res.body).toEqual({ message: "new user created in database" });


            return done();
        }catch(err){
            return done(err);
        }
    });

    it('/users GET', async (done) => {
        try{
            const res = await request(app)
                .get('/users');

            expect(res.body.length).toEqual(11);
            return done();
        }catch(err){
            return done(err);
        }
    });
});
/*
//the actual login route is not defined or used here, so nothing is working....
describe('login and logout', () => {
    it('accessing /users/11 should fail when not logged in', async (done) => {
        try{
            const agent = await request.agent(app);
            agent.get('/users/11');
            expect(agent.body).toEqual({ message: "Log in to access this page" });
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('response when successfully logged in', async (done) => {
        try{
            const agent = await request.agent(app)
                .post('/login').send({ username: 'testuser', password: 'testpassword' });
            //expect(res.body).toEqual({ message: "Successfully logged in" });
            expect(agent.status).toEqual(200);
            return done();
        }catch(err){
            return done(err);
        }
    });
});*/


/* //get login/logout working before testing this since /users/:id is protected route
describe('/users/:id GET - checking topic weights', () => {
    //bob should have 104 history, and no medical (100 will be used in this case)
    it('Check Bob topic weights', async (done) => {
        try{
            const res = await request(app)
                .get('/users/2')
            expect(res.status).toEqual(200);

            expect(res.body.weights.length).toEqual(1);
            expect(res.body.weights[0].question_topic).toEqual('Law and Government');
            expect(res.body.weights[0].count).toEqual(104);
            return done();
        }catch(err){
            return done(err);
        }
    });

    //Catherine should have 101 history, and 105 medical
    it('Check Catherine topic weights', async (done) => {
        try{
            const res = await request(app)
                .get('/users/3')
            expect(res.status).toEqual(200);

            expect(res.body.weights.length).toEqual(2);

            for(let i = 0; i < res.body.weights.length; i++) {
                switch(res.body.weights[i].question_topic) {
                    case 'Medicine and Healthcare':
                        expect(res.body.weights[i].count).toEqual(105);
                        break;
                    case 'Law and Government':
                        expect(res.body.weights[i].count).toEqual(101);
                        break;
                }
            }
            return done();
        }catch(err){
            return done(err);
        }
    });
});*/


