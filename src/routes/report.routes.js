const express = require('express');
const router = express.Router();
const {
  getOverview,
  getPatientStats,
  getAppointmentStats,
  getRevenueStats,
  getDetailedMetrics,
} = require('../controllers/report.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/reports/overview
 * @desc    Get dashboard overview statistics
 * @access  Private (Admin - full, Doctor - limited, Billing - financial)
 */
router.get(
  '/overview',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.BILLING_STAFF),
  getOverview
);

/**
 * @route   GET /api/reports/patients
 * @desc    Get patient statistics
 * @access  Private (Admin, Receptionist)
 */
router.get(
  '/patients',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST),
  getPatientStats
);

/**
 * @route   GET /api/reports/appointments
 * @desc    Get appointment statistics
 * @access  Private (Admin, Doctor, Receptionist)
 */
router.get(
  '/appointments',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST),
  getAppointmentStats
);

/**
 * @route   GET /api/reports/revenue
 * @desc    Get revenue/financial reports
 * @access  Private (Admin, Billing Staff only)
 */
router.get(
  '/revenue',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF),
  getRevenueStats
);

/**
 * @route   GET /api/reports/metrics
 * @desc    Get detailed report metrics
 * @access  Private (Admin only)
 */
router.get('/metrics', authenticate, authorize(ROLES.SUPER_ADMIN), getDetailedMetrics);

module.exports = router;
