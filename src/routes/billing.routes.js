const express = require('express');
const router = express.Router();
const {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  getBillingSummary,
} = require('../controllers/billing.controller');
const { authenticate } = require('../common/middleware/auth.middleware');
const { authorize, ROLES } = require('../common/middleware/role.middleware');

/**
 * @route   GET /api/invoices/summary
 * @desc    Get billing summary/statistics
 * @access  Private (Admin, Billing Staff only)
 */
router.get(
  '/summary',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF),
  getBillingSummary
);

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices (Admin/Billing - all, Patient - own only)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF, ROLES.PATIENT),
  getAllInvoices
);

/**
 * @route   GET /api/invoices/:id
 * @desc    Get invoice by ID
 * @access  Private (Admin, Billing Staff, Patient - own only)
 */
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF, ROLES.PATIENT),
  getInvoiceById
);

/**
 * @route   POST /api/invoices
 * @desc    Create new invoice
 * @access  Private (Admin, Billing Staff only)
 */
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF),
  createInvoice
);

/**
 * @route   PUT /api/invoices/:id
 * @desc    Update invoice
 * @access  Private (Admin, Billing Staff only)
 */
router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF),
  updateInvoice
);

module.exports = router;
