const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patient.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES, ROLE_GROUPS } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/patients
 * @desc    Get all patients (role-based filtering applied in controller)
 * @access  Private (Admin - all, Doctor - assigned only, Patient - own, Receptionist/Billing - all)
 */
router.get(
  '/',
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
    ROLES.BILLING_STAFF,
    ROLES.PATIENT
  ),
  getAllPatients
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID
 * @access  Private (Admin, Doctor - if assigned, Patient - own only, Receptionist, Billing)
 */
router.get(
  '/:id',
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.DOCTOR,
    ROLES.RECEPTIONIST,
    ROLES.BILLING_STAFF,
    ROLES.PATIENT
  ),
  getPatientById
);

/**
 * @route   POST /api/patients
 * @desc    Create new patient
 * @access  Private (Admin, Receptionist only)
 */
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST),
  createPatient
);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient
 * @access  Private (Admin, Receptionist only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST),
  updatePatient
);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN), deletePatient);

module.exports = router;
