//this is the API all controllers will use to access database
const Pool = require('pg').Pool;
const debug = require('debug')('user');

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

exports.query = function(text, params, callback) {
  const start = Date.now();
  return pool.query(text, params, (err, results) => {
    const duration = Date.now() - start;
    const rowCount = results ? results.rowCount : 'none';
    debug('executed query', { text: text, params: params, duration: duration + ' ms', rows: rowCount });
    callback(err, results);
  });
};
