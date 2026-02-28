'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

// ─── App Init ────────────────────────────────────────────────────────────────
const app = express();

// ─── Connect to Database ─────────────────────────────────────────────────────
connectDB();

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://thebengalibowl.netlify.app',
  ],
  credentials: true,
}));

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ─── General Middleware ───────────────────────────────────────────────────────
app.use(express.json());         // Parse JSON bodies (replaces body-parser)
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));         // HTTP request logger
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Restaurant Management API 🍽️',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      persons: '/api/persons',
      menu: '/api/menu',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/menu', menuRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler (MUST be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 // console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});


module.exports = app; // Export for testing
