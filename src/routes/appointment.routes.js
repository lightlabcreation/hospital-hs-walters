const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorSchedule,
} = require('../controllers/appointment.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments (role-based filtering in controller)
 * @access  Private (Admin, Doctor - assigned, Receptionist, Patient - own only)
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
  getAllAppointments
);

/**
 * @route   GET /api/appointments/schedule/:doctorId
 * @desc    Get doctor's schedule/available slots
 * @access  Private (Admin, Doctor, Receptionist)
 */
router.get(
  '/schedule/:doctorId',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  getDoctorSchedule
);

/**
 * @route   GET /api/appointments/:id
 * @desc    Get appointment by ID
 * @access  Private (Admin, Doctor - if assigned, Receptionist, Patient - own only)
 */
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT),
  getAppointmentById
);

/**
 * @route   POST /api/appointments
 * @desc    Create new appointment
 * @access  Private (Admin, Doctor, Receptionist only - Patient CANNOT book)
 */
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  createAppointment
);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update appointment
 * @access  Private (Admin, Doctor, Receptionist)
 */
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  updateAppointment
);

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete appointment
 * @access  Private (Admin, Receptionist only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST),
  deleteAppointment
);

module.exports = router;
