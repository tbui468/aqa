//testing users routes and controller based off default populate.sql default values
//IF populate.sql is changed, these test may fail!! So change tests along with populate.sql


const express = require('express');
const request = require('supertest');
const questionsRouter = require('./../routes/questions');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/questions', questionsRouter);

describe('/questions GET', () => {
    it('users index count', async (done) => {
        try{
            const res = await request(app)
                .get('/questions')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(5);
            return done();
        }catch(err){
            return done(err);
        }
    });
});


describe('/questions/:id GET', () => {
    it('/questions/1 GET both answer should have equal weight', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/1')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.question.user_name).toEqual('Abel');
            expect(res.body.answers.length).toEqual(2);
            expect(res.body.answers[0].answer_percent).toEqual(0.5);
            expect(res.body.answers[1].answer_percent).toEqual(0.5);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/3 GET, two votes, expect Heather to have higher weighted answer', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/3')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.question.user_name).toEqual('Abel');
            expect(res.body.answers.length).toEqual(2);
            expect(res.body.answers[0].answer_percent).toBeLessThan(res.body.answers[1].answer_percent);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/4 GET, two votes, expect Bob to have higher weighted answer', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/4')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.question.user_name).toEqual('Abel');
            expect(res.body.answers.length).toEqual(2);
            expect(res.body.answers[0].answer_percent).toBeGreaterThan(res.body.answers[1].answer_percent);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/5 GET, two votes, expect Heather and Bob to have equal weights', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/5')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.question.user_name).toEqual('Abel');
            expect(res.body.answers.length).toEqual(2);
            expect(res.body.answers[0].answer_percent).toEqual(res.body.answers[1].answer_percent);
            return done();
        }catch(err){
            return done(err);
        }
    });
});

