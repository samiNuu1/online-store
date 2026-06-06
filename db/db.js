const { Pool } = require('pg');

// Create a connection pool to the PostgreSQL database
// Pool is used instead of a single Client because it handles
// multiple simultaneous requests efficiently
const pool = new Pool({
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host:     process.env.PGHOST,
  port:     process.env.PGPORT,
  database: process.env.PGDATABASE
});

module.exports = pool;
