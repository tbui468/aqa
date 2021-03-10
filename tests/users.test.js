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
            expect(res.body.length).toEqual(3);
            return done();
        }catch(err){
            return done(err);
        }
    });
});
/*
//need to implement users logging to test this route since profile pages are private
describe('/users/1 GET', () => {
    it('show user data', async (done) => {
        try{
            const res = await request(app)
                .get('/users/1')
            expect(res.status).toEqual(400);
            return done();
        }catch(err){
            return done(err);
        }
    });
});*/

