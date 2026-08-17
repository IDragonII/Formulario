const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.POSTGRES_DB || 'suge_encuesta',
  user: process.env.POSTGRES_USER || 'suge_admin',
  password: process.env.POSTGRES_PASSWORD || 'suge_pass_2026',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(1);
});

module.exports = pool;
