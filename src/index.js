require('dotenv').config();

const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend static files
const publicDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Rate limiting general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intente más tarde' },
});
app.use('/api/', limiter);

// Rate limiting estricto para envío de encuestas
const respLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Límite de envíos alcanzado, intente más tarde' },
});

// API routes
app.use('/api/respuestas', respLimiter, require('./routes/respuestas'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`SUGE corriendo en http://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
