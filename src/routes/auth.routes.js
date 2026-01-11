const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../common/middleware/auth.middleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login for all roles (single login endpoint)
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (stateless - handled on frontend)
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, getMe);

module.exports = router;
