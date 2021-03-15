//testing users routes and controller based off default populate.sql default values
//IF populate.sql is changed, these test may fail!! So change tests along with populate.sql


const express = require('express');
const request = require('supertest');
const answersRouter = require('./../routes/answers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/questions', answersRouter);

//test question 1, answers 1 and 3
describe('show answers equal weight', () => {
    it('/questions/1/answers/1 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/1/answers/1')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(0);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/1/answers/3 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/1/answers/3')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(500);
            return done();
        }catch(err){
            return done(err);
        }
    });
});

//test question 3, answers 5 and 6
describe('show answers unequal weight', () => {
    it('/questions/3/answers/5 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/3/answers/5')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(100);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/3/answers/6 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/3/answers/6')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(105);
            return done();
        }catch(err){
            return done(err);
        }
    });
});


//test question 4, answers 7 and 8
describe('show answers unequal weight', () => {
    it('/questions/4/answers/7 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/4/answers/7')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(104);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/4/answers/8 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/4/answers/8')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(101);
            return done();
        }catch(err){
            return done(err);
        }
    });
});


//test question 5, answers 9 and 10
describe('show answers unequal weight', () => {
    it('/questions/5/answers/9 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/5/answers/9')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(100);
            return done();
        }catch(err){
            return done(err);
        }
    });
    it('/questions/5/answers/10 GET', async (done) => {
        try{
            const res = await request(app)
                .get('/questions/5/answers/10')
                .set('Accept', 'application/json');
            expect(res.status).toEqual(200);
            expect(res.body.weight).toEqual(100);
            return done();
        }catch(err){
            return done(err);
        }
    });
});
