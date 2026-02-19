const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, updateProfile, getUsers } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Debug logging
console.log('=== AUTH ROUTES LOADING ===');
console.log('register:', typeof register);
console.log('login:', typeof login);
console.log('getUsers:', typeof getUsers);
console.log('authMiddleware:', typeof authMiddleware);

// Public routes
router.post('/register', (req, res, next) => {
  console.log('POST /register called');
  register(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('POST /login called');
  login(req, res, next);
});

router.post('/forgot-password', (req, res, next) => {
  console.log('POST /forgot-password called');
  forgotPassword(req, res, next);
});

router.post('/reset-password', (req, res, next) => {
  console.log('POST /reset-password called');
  resetPassword(req, res, next);
});

// Test route
router.get('/test', (req, res) => {
  console.log('GET /test called');
  res.json({ message: 'Test route works' });
});

// Protected routes
router.put('/profile', authMiddleware, (req, res, next) => {
  console.log('PUT /profile called');
  updateProfile(req, res, next);
});

router.get('/users', authMiddleware, (req, res, next) => {
  console.log('GET /users called');
  getUsers(req, res, next);
});

console.log('=== AUTH ROUTES LOADED ===');

module.exports = router;