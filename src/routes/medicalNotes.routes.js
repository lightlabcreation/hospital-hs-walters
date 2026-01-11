const express = require('express');
const router = express.Router();
const {
  getAllMedicalNotes,
  getMedicalNoteById,
  createMedicalNote,
  updateMedicalNote,
} = require('../controllers/medicalNotes.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/medical-notes
 * @desc    Get all medical notes (Admin - all, Doctor - own created, Patient - own only)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
  getAllMedicalNotes
);

/**
 * @route   GET /api/medical-notes/:id
 * @desc    Get medical note by ID
 * @access  Private (Admin, Doctor - own created, Patient - own only)
 */
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.PATIENT),
  getMedicalNoteById
);

/**
 * @route   POST /api/medical-notes
 * @desc    Create new medical note
 * @access  Private (Doctor only)
 */
router.post('/', authenticate, authorize(ROLES.DOCTOR), createMedicalNote);

/**
 * @route   PUT /api/medical-notes/:id
 * @desc    Update medical note
 * @access  Private (Doctor only - who created it)
 */
router.put('/:id', authenticate, authorize(ROLES.DOCTOR), updateMedicalNote);

module.exports = router;
