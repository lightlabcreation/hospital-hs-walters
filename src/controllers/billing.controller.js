const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all invoices
 * GET /api/invoices
 * Access: Admin - all, Billing Staff - all, Patient - own only
 */
const getAllInvoices = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (patient) {
        where.patientId = patient.id;
      } else {
        return res.status(200).json({ data: [], pagination: { total: 0 } });
      }
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Search filter
    if (search) {
      where.OR = [
        { invoiceId: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
        { patient: { patientId: { contains: search } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          patient: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    // Format response
    const formattedInvoices = invoices.map((inv) => ({
      id: inv.id,
      invoiceId: inv.invoiceId,
      patient: inv.patient.user.name,
      patientId: inv.patient.patientId,
      amount: inv.amount,
      status: inv.status,
      dueDate: inv.dueDate,
      method: inv.method,
      items: inv.items,
      date: inv.createdAt,
    }));

    return res.status(200).json({
      data: formattedInvoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all invoices error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get invoice by ID
 * GET /api/invoices/:id
 */
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const queryId = parseInt(id);
    const whereCondition = isNaN(queryId)
      ? { invoiceId: id }
      : { OR: [{ id: queryId }, { invoiceId: id }] };

    const invoice = await prisma.invoice.findFirst({
      where: whereCondition,
      include: {
        patient: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found.',
      });
    }

    // Role-based access check for patient
    if (req.user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (!patient || invoice.patientId !== patient.id) {
        return res.status(403).json({
          message: 'Access denied. This is not your invoice.',
        });
      }
    }

    return res.status(200).json({
      id: invoice.id,
      invoiceId: invoice.invoiceId,
      patient: invoice.patient.user.name,
      patientId: invoice.patient.patientId,
      patientEmail: invoice.patient.user.email,
      amount: invoice.amount,
      status: invoice.status,
      dueDate: invoice.dueDate,
      method: invoice.method,
      items: invoice.items,
      date: invoice.createdAt,
    });
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new invoice
 * POST /api/invoices
 * Access: Admin, Billing Staff
 */
const createInvoice = async (req, res) => {
  try {
    const { patientId, amount, dueDate, method, items } = req.body;

    // Validation
    if (!patientId || !amount) {
      return res.status(400).json({
        message: 'Patient and amount are required.',
      });
    }

    // Find patient
    const patientQueryId = parseInt(patientId);
    const patientWhere = isNaN(patientQueryId)
      ? { patientId: patientId }
      : { OR: [{ id: patientQueryId }, { patientId: patientId }] };

    const patient = await prisma.patient.findFirst({
      where: patientWhere,
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found.',
      });
    }

    // Generate invoice ID
    const year = new Date().getFullYear();
    const invoiceCount = await prisma.invoice.count();
    const invoiceId = `INV-${year}-${String(invoiceCount + 1).padStart(3, '0')}`;

    // Calculate due date (default 7 days from now)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceId,
        patientId: patient.id,
        amount: parseFloat(amount),
        dueDate: dueDate ? new Date(dueDate) : defaultDueDate,
        method: method || 'Cash',
        items: items || null,
        status: 'Pending',
      },
      include: {
        patient: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Invoice created successfully.',
      data: {
        id: invoice.id,
        invoiceId: invoice.invoiceId,
        patient: invoice.patient.user.name,
        amount: invoice.amount,
        status: invoice.status,
        dueDate: invoice.dueDate,
      },
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update invoice
 * PUT /api/invoices/:id
 * Access: Admin, Billing Staff
 */
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, dueDate, method, items } = req.body;

    // Find invoice
    const queryId = parseInt(id);
    const whereCondition = isNaN(queryId)
      ? { invoiceId: id }
      : { OR: [{ id: queryId }, { invoiceId: id }] };

    const invoice = await prisma.invoice.findFirst({
      where: whereCondition,
    });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found.',
      });
    }

    // Update invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        ...(amount && { amount: parseFloat(amount) }),
        ...(status && { status }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(method && { method }),
        ...(items !== undefined && { items }),
      },
      include: {
        patient: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Invoice updated successfully.',
      data: {
        id: updatedInvoice.id,
        invoiceId: updatedInvoice.invoiceId,
        patient: updatedInvoice.patient.user.name,
        amount: updatedInvoice.amount,
        status: updatedInvoice.status,
        dueDate: updatedInvoice.dueDate,
      },
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get billing summary/stats
 * GET /api/invoices/summary
 * Access: Admin, Billing Staff
 */
const getBillingSummary = async (req, res) => {
  try {
    const [totalInvoices, pendingInvoices, paidInvoices, overdueInvoices] = await Promise.all([
      prisma.invoice.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { status: 'Pending' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { status: 'Paid' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { status: 'Overdue' },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return res.status(200).json({
      total: {
        count: totalInvoices._count,
        amount: totalInvoices._sum.amount || 0,
      },
      pending: {
        count: pendingInvoices._count,
        amount: pendingInvoices._sum.amount || 0,
      },
      paid: {
        count: paidInvoices._count,
        amount: paidInvoices._sum.amount || 0,
      },
      overdue: {
        count: overdueInvoices._count,
        amount: overdueInvoices._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error('Get billing summary error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  getBillingSummary,
};
