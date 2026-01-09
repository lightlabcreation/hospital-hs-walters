const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get dashboard overview statistics
 * GET /api/reports/overview
 * Access: Admin - full, Doctor - limited, Billing - financial only
 */
const getOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Base stats
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      monthlyAppointments,
      pendingAppointments,
      completedAppointments,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.appointment.count({
        where: { date: { gte: startOfMonth } },
      }),
      prisma.appointment.count({
        where: { status: 'Scheduled' },
      }),
      prisma.appointment.count({
        where: { status: 'Completed' },
      }),
    ]);

    // Financial stats (only for admin and billing)
    let financialStats = null;
    if (req.user.role === 'super_admin' || req.user.role === 'billing_staff') {
      const [totalRevenue, pendingPayments, paidInvoices] = await Promise.all([
        prisma.invoice.aggregate({
          where: { status: 'Paid' },
          _sum: { amount: true },
        }),
        prisma.invoice.aggregate({
          where: { status: { in: ['Pending', 'Overdue'] } },
          _sum: { amount: true },
          _count: true,
        }),
        prisma.invoice.count({
          where: { status: 'Paid', createdAt: { gte: startOfMonth } },
        }),
      ]);

      financialStats = {
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingPayments: pendingPayments._sum.amount || 0,
        pendingCount: pendingPayments._count,
        monthlyPaidInvoices: paidInvoices,
      };
    }

    // Response
    const response = {
      patients: {
        total: totalPatients,
        label: 'Total Patients',
      },
      doctors: {
        total: totalDoctors,
        label: 'Active Doctors',
      },
      appointments: {
        total: totalAppointments,
        today: todayAppointments,
        monthly: monthlyAppointments,
        pending: pendingAppointments,
        completed: completedAppointments,
        label: 'Appointments',
      },
    };

    if (financialStats) {
      response.financial = financialStats;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get overview error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get patient statistics
 * GET /api/reports/patients
 * Access: Admin, Receptionist
 */
const getPatientStats = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [
      totalPatients,
      newPatientsThisMonth,
      malePatients,
      femalePatients,
      patientsByBloodGroup,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.patient.count({ where: { gender: 'Male' } }),
      prisma.patient.count({ where: { gender: 'Female' } }),
      prisma.patient.groupBy({
        by: ['bloodGroup'],
        _count: true,
      }),
    ]);

    return res.status(200).json({
      total: totalPatients,
      newThisMonth: newPatientsThisMonth,
      byGender: {
        male: malePatients,
        female: femalePatients,
      },
      byBloodGroup: patientsByBloodGroup.map((g) => ({
        bloodGroup: g.bloodGroup || 'Not Specified',
        count: g._count,
      })),
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get appointment statistics
 * GET /api/reports/appointments
 * Access: Admin, Doctor, Receptionist
 */
const getAppointmentStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let where = {};

    // Role-based filtering for doctors
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    }

    const [
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
      todayAppointments,
      weeklyAppointments,
      monthlyAppointments,
      appointmentsByType,
    ] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.count({ where: { ...where, status: 'Scheduled' } }),
      prisma.appointment.count({ where: { ...where, status: 'Completed' } }),
      prisma.appointment.count({ where: { ...where, status: 'Cancelled' } }),
      prisma.appointment.count({
        where: {
          ...where,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.appointment.count({
        where: { ...where, date: { gte: startOfWeek } },
      }),
      prisma.appointment.count({
        where: { ...where, date: { gte: startOfMonth } },
      }),
      prisma.appointment.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
    ]);

    return res.status(200).json({
      total: totalAppointments,
      byStatus: {
        scheduled: scheduledAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
      byPeriod: {
        today: todayAppointments,
        weekly: weeklyAppointments,
        monthly: monthlyAppointments,
      },
      byType: appointmentsByType.map((t) => ({
        type: t.type || 'Not Specified',
        count: t._count,
      })),
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get revenue/financial reports
 * GET /api/reports/revenue
 * Access: Admin, Billing Staff only
 */
const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      pendingPayments,
      overduePayments,
      invoicesByStatus,
      invoicesByMethod,
    ] = await Promise.all([
      prisma.invoice.aggregate({
        where: { status: 'Paid' },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: 'Paid', createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: 'Paid', createdAt: { gte: startOfYear } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: 'Pending' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { status: 'Overdue' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.groupBy({
        by: ['status'],
        _count: true,
        _sum: { amount: true },
      }),
      prisma.invoice.groupBy({
        by: ['method'],
        _count: true,
        _sum: { amount: true },
      }),
    ]);

    return res.status(200).json({
      revenue: {
        total: totalRevenue._sum.amount || 0,
        monthly: monthlyRevenue._sum.amount || 0,
        yearly: yearlyRevenue._sum.amount || 0,
      },
      pending: {
        count: pendingPayments._count,
        amount: pendingPayments._sum.amount || 0,
      },
      overdue: {
        count: overduePayments._count,
        amount: overduePayments._sum.amount || 0,
      },
      byStatus: invoicesByStatus.map((s) => ({
        status: s.status,
        count: s._count,
        amount: s._sum.amount || 0,
      })),
      byMethod: invoicesByMethod.map((m) => ({
        method: m.method || 'Not Specified',
        count: m._count,
        amount: m._sum.amount || 0,
      })),
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get detailed report metrics
 * GET /api/reports/metrics
 * Access: Admin only
 */
const getDetailedMetrics = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      newRegistrations,
      labTestsDone,
      pendingInvoicesCount,
      missedFollowups,
    ] = await Promise.all([
      prisma.patient.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.labResult.count({
        where: { status: 'Final', createdAt: { gte: startOfMonth } },
      }),
      prisma.invoice.count({
        where: { status: { in: ['Pending', 'Overdue'] } },
      }),
      prisma.appointment.count({
        where: {
          status: 'Scheduled',
          date: { lt: new Date() },
        },
      }),
    ]);

    return res.status(200).json({
      metrics: [
        {
          id: 'RPT-001',
          category: 'New Registrations',
          total: newRegistrations,
          trend: newRegistrations > 10 ? 'Increasing' : 'Stable',
          details: `${newRegistrations} new patient registrations this month.`,
        },
        {
          id: 'RPT-002',
          category: 'Lab Tests Done',
          total: labTestsDone,
          trend: 'Stable',
          details: 'Lab reports processed within standard TAT.',
        },
        {
          id: 'RPT-003',
          category: 'Pending Invoices',
          total: pendingInvoicesCount,
          trend: pendingInvoicesCount > 15 ? 'High Priority' : 'Low',
          details: `${pendingInvoicesCount} outstanding invoices require attention.`,
        },
        {
          id: 'RPT-004',
          category: 'Follow-ups Missed',
          total: missedFollowups,
          trend: missedFollowups > 5 ? 'High Priority' : 'Low',
          details: `${missedFollowups} appointments past their scheduled date.`,
        },
      ],
    });
  } catch (error) {
    console.error('Get detailed metrics error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getOverview,
  getPatientStats,
  getAppointmentStats,
  getRevenueStats,
  getDetailedMetrics,
};
