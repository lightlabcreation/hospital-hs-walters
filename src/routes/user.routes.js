const express = require('express');
const router = express.Router();
const {
  getProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user profile
 * @access  Private (All authenticated users)
 */
router.get('/me', authenticate, getProfile);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Super Admin only)
 */
router.get('/', authenticate, authorize(ROLES.SUPER_ADMIN), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Super Admin only)
 */
router.get('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), getUserById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Super Admin only)
 */
router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Super Admin only)
 */
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Super Admin only)
 */
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), deleteUser);

module.exports = router;
