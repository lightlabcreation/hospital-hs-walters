const express = require('express');
const router = express.Router();
const {
  getAllLabResults,
  getLabResultById,
  createLabResult,
  updateLabResult,
} = require('../controllers/lab.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/lab-results
 * @desc    Get all lab results (Admin - all, Doctor - own created, Patient - own only)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
  getAllLabResults
);

/**
 * @route   GET /api/lab-results/:id
 * @desc    Get lab result by ID
 * @access  Private (Admin, Doctor - own created, Patient - own only)
 */
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
  getLabResultById
);

/**
 * @route   POST /api/lab-results
 * @desc    Create new lab result
 * @access  Private (Doctor only)
 */
router.post('/', authenticate, authorize(ROLES.DOCTOR), createLabResult);

/**
 * @route   PUT /api/lab-results/:id
 * @desc    Update lab result
 * @access  Private (Doctor only - who created it)
 */
router.put('/:id', authenticate, authorize(ROLES.DOCTOR), updateLabResult);

module.exports = router;
