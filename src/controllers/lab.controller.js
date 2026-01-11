const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all lab results
 * GET /api/lab-results
 * Access: Admin - all, Doctor - all/created, Patient - own only
 */
const getAllLabResults = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    // Role-based filtering
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (doctor) {
        where.doctorId = doctor.id;
      } else {
        return res.status(200).json({ data: [], pagination: { total: 0 } });
      }
    } else if (req.user.role === 'patient') {
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
        { labId: { contains: search } },
        { testName: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
      ];
    }

    const [labResults, total] = await Promise.all([
      prisma.labResult.findMany({
        where,
        include: {
          patient: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
          doctor: {
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
      prisma.labResult.count({ where }),
    ]);

    // Format response
    const formattedLabResults = labResults.map((lab) => ({
      id: lab.id,
      labId: lab.labId,
      patient: lab.patient.user.name,
      patientId: lab.patient.patientId,
      doctor: lab.doctor.user.name,
      testName: lab.testName,
      findings: lab.findings,
      results: lab.results,
      technician: lab.technician,
      status: lab.status,
      date: lab.createdAt,
    }));

    return res.status(200).json({
      data: formattedLabResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all lab results error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get lab result by ID
 * GET /api/lab-results/:id
 */
const getLabResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const labResult = await prisma.labResult.findFirst({
      where: {
        OR: [{ id }, { labId: id }],
      },
      include: {
        patient: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!labResult) {
      return res.status(404).json({
        message: 'Lab result not found.',
      });
    }

    // Role-based access check
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (!doctor || labResult.doctorId !== doctor.id) {
        return res.status(403).json({
          message: 'Access denied. This lab result was not created by you.',
        });
      }
    } else if (req.user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (!patient || labResult.patientId !== patient.id) {
        return res.status(403).json({
          message: 'Access denied. This is not your lab result.',
        });
      }
    }

    return res.status(200).json({
      id: labResult.id,
      labId: labResult.labId,
      patient: labResult.patient.user.name,
      patientId: labResult.patient.patientId,
      doctor: labResult.doctor.user.name,
      testName: labResult.testName,
      findings: labResult.findings,
      results: labResult.results,
      technician: labResult.technician,
      status: labResult.status,
      date: labResult.createdAt,
    });
  } catch (error) {
    console.error('Get lab result by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new lab result
 * POST /api/lab-results
 * Access: Doctor only
 */
const createLabResult = async (req, res) => {
  try {
    const { patientId, testName, findings, results, technician, status } = req.body;

    // Validation
    if (!patientId || !testName) {
      return res.status(400).json({
        message: 'Patient and test name are required.',
      });
    }

    // Get doctor from authenticated user
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctor) {
      return res.status(403).json({
        message: 'Doctor profile not found.',
      });
    }

    // Find patient
    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id: patientId }, { patientId: patientId }],
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found.',
      });
    }

    // Generate lab ID
    const year = new Date().getFullYear();
    const labCount = await prisma.labResult.count();
    const labId = `LAB-${year}-${String(labCount + 1).padStart(3, '0')}`;

    // Create lab result
    const labResult = await prisma.labResult.create({
      data: {
        labId,
        patientId: patient.id,
        doctorId: doctor.id,
        testName,
        findings: findings || '',
        results: results || null,
        technician: technician || '',
        status: status || 'Pending',
      },
      include: {
        patient: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Lab result created successfully.',
      data: {
        id: labResult.id,
        labId: labResult.labId,
        patient: labResult.patient.user.name,
        doctor: labResult.doctor.user.name,
        testName: labResult.testName,
        status: labResult.status,
      },
    });
  } catch (error) {
    console.error('Create lab result error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update lab result
 * PUT /api/lab-results/:id
 * Access: Doctor only (who created it)
 */
const updateLabResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { testName, findings, results, technician, status } = req.body;

    // Find lab result
    const labResult = await prisma.labResult.findFirst({
      where: {
        OR: [{ id }, { labId: id }],
      },
    });

    if (!labResult) {
      return res.status(404).json({
        message: 'Lab result not found.',
      });
    }

    // Check if doctor owns this lab result
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctor || labResult.doctorId !== doctor.id) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own lab results.',
      });
    }

    // Update lab result
    const updatedLabResult = await prisma.labResult.update({
      where: { id: labResult.id },
      data: {
        ...(testName && { testName }),
        ...(findings !== undefined && { findings }),
        ...(results !== undefined && { results }),
        ...(technician !== undefined && { technician }),
        ...(status && { status }),
      },
      include: {
        patient: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Lab result updated successfully.',
      data: {
        id: updatedLabResult.id,
        labId: updatedLabResult.labId,
        patient: updatedLabResult.patient.user.name,
        doctor: updatedLabResult.doctor.user.name,
        testName: updatedLabResult.testName,
        status: updatedLabResult.status,
      },
    });
  } catch (error) {
    console.error('Update lab result error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllLabResults,
  getLabResultById,
  createLabResult,
  updateLabResult,
};
