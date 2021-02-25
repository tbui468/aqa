//this is the API all controllers will use to access database
const Pool = require('pg').Pool;
const debug = require('debug')('user');
const async = require('async');

/* //use this for production/deployment on heroku
const pool = new Pool({
  connectionString = process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});*/

const pool = new Pool({
  user: 'thomas',
  host: 'localhost',
  database: 'thomas',
  password: 'password',
  port: 5432
});

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

  }
}

