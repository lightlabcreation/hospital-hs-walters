/**
 * Role-Based Authorization Middleware
 * Checks if the authenticated user has the required role(s)
 */

/**
 * Authorize specific roles
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: 'Access denied. Authentication required.',
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

/**
 * Role Constants for easy reference
 */
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  BILLING_STAFF: 'billing_staff',
  PATIENT: 'patient',
};

/**
 * Common role combinations
 */
const ROLE_GROUPS = {
  // All roles
  ALL: Object.values(ROLES),

  // Admin only
  ADMIN_ONLY: [ROLES.SUPER_ADMIN],

  // Staff roles (can manage patients/appointments)
  STAFF: [ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST],

  // Medical staff (doctors and admin)
  MEDICAL: [ROLES.SUPER_ADMIN, ROLES.DOCTOR],

  // Billing access
  BILLING: [ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF],

  // Can create appointments
  CAN_CREATE_APPOINTMENTS: [ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],

  // Can view all patients
  CAN_VIEW_ALL_PATIENTS: [ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST, ROLES.BILLING_STAFF],

  // Can create patients
  CAN_CREATE_PATIENTS: [ROLES.SUPER_ADMIN, ROLES.RECEPTIONIST],
};

module.exports = {
  authorize,
  ROLES,
  ROLE_GROUPS,
};
