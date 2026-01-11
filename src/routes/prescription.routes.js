const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require('../controllers/prescription.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/prescriptions
 * @desc    Get all prescriptions (Admin - all, Doctor - read only, Patient - own only)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
  getAllPrescriptions
);

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get prescription by ID
 * @access  Private (Admin, Doctor - read only, Patient - own only)
 */
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
  getPrescriptionById
);

/**
 * @route   POST /api/prescriptions
 * @desc    Create new prescription (Prescription Bank)
 * @access  Private (Admin only - Doctor is READ ONLY)
 */
router.post('/', authenticate, authorize(ROLES.SUPER_ADMIN), createPrescription);

/**
 * @route   PUT /api/prescriptions/:id
 * @desc    Update prescription
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), updatePrescription);

/**
 * @route   DELETE /api/prescriptions/:id
 * @desc    Delete prescription
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), deletePrescription);

module.exports = router;
