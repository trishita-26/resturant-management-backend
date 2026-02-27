const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validators/personValidator');

// POST /api/auth/signup — create new staff account (public)
router.post('/signup', validate(signupSchema), signup);

// POST /api/auth/login — get JWT token (public)
router.post('/login', validate(loginSchema), login);

module.exports = router;
