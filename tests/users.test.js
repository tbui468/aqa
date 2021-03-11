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
            expect(res.body.weights[0].question_topic).toEqual('Medicine and Healthcare');
            expect(res.body.weights[0].count).toEqual(105);
            expect(res.body.weights[1].question_topic).toEqual('Law and Government');
            expect(res.body.weights[1].count).toEqual(101);
            return done();
        }catch(err){
            return done(err);
        }
    });
});

