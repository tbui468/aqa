//this is the API all controllers will use to access database
const Pool = require('pg').Pool;
const debug = require('debug')('user');
const async = require('async');

/*
DB_USER='thomas'
DB_HOST='localhost'
DB_DATABASE='thomas'
DB_PASSWORD='password'
PORT='3000'*/

 //use this for production/deployment on heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
/*
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20
});*/

module.exports = {
  async query(text, params) {
    const start = Date.now();
    const results = await pool.query(text, params);
    const duration = Date.now() - start;
    const rowCount = results ? results.rowCount : 'none';
    debug('executed query', { text: text, params: params, duration: duration + ' ms', rows: rowCount });
    return results;
  },
  async getClient() {
    const client = await pool.connect();
    const query = client.query; //saving for later?
    const release = client.release; //saving for later?
    const timeout = setTimeout(() => {
      console.error('ypes');
      console.error('ypes');
    }, 5000);
    //????
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    }
    //resetting??
    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    }
    return client;
  }
}
