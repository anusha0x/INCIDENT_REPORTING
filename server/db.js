const { Pool } = require('pg');
require('dotenv').config();

// The Pool manages multiple connections for concurrent users (Requirement #5)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this matches your .env key
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// A log to confirm the connection is working
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database successfully.');
});

// Error handling for the pool (Reliability thinking)
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};