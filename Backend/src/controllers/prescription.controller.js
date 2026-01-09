const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all prescriptions
 * GET /api/prescriptions
 * Access: Admin - all CRUD, Doctor - read only, Patient - own only
 */
const getAllPrescriptions = async (req, res) => {
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
        { prescriptionId: { contains: search } },
        { medications: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
      ];
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
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
      prisma.prescription.count({ where }),
    ]);

    // Format response
    const formattedPrescriptions = prescriptions.map((pre) => ({
      id: pre.id,
      prescriptionId: pre.prescriptionId,
      patient: pre.patient.user.name,
      patientId: pre.patient.patientId,
      doctor: pre.doctor.user.name,
      doctorId: pre.doctor.doctorId,
      medications: pre.medications,
      dosage: pre.dosage,
      duration: pre.duration,
      instructions: pre.instructions,
      status: pre.status,
      date: pre.createdAt,
    }));

    return res.status(200).json({
      data: formattedPrescriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all prescriptions error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get prescription by ID
 * GET /api/prescriptions/:id
 */
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findFirst({
      where: {
        OR: [{ id }, { prescriptionId: id }],
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

    if (!prescription) {
      return res.status(404).json({
        message: 'Prescription not found.',
      });
    }

    // Role-based access check for patient
    if (req.user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (!patient || prescription.patientId !== patient.id) {
        return res.status(403).json({
          message: 'Access denied. This is not your prescription.',
        });
      }
    }

    return res.status(200).json({
      id: prescription.id,
      prescriptionId: prescription.prescriptionId,
      patient: prescription.patient.user.name,
      patientId: prescription.patient.patientId,
      doctor: prescription.doctor.user.name,
      doctorId: prescription.doctor.doctorId,
      medications: prescription.medications,
      dosage: prescription.dosage,
      duration: prescription.duration,
      instructions: prescription.instructions,
      status: prescription.status,
      date: prescription.createdAt,
    });
  } catch (error) {
    console.error('Get prescription by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new prescription
 * POST /api/prescriptions
 * Access: Admin only (Prescription Bank management)
 */
const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medications, dosage, duration, instructions } = req.body;

    // Validation
    if (!patientId || !doctorId || !medications) {
      return res.status(400).json({
        message: 'Patient, doctor, and medications are required.',
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

    // Find doctor
    const doctor = await prisma.doctor.findFirst({
      where: {
        OR: [{ id: doctorId }, { doctorId: doctorId }],
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found.',
      });
    }

    // Generate prescription ID
    const year = new Date().getFullYear();
    const prescriptionCount = await prisma.prescription.count();
    const prescriptionId = `PRE-${year}-${String(prescriptionCount + 1).padStart(3, '0')}`;

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        prescriptionId,
        patientId: patient.id,
        doctorId: doctor.id,
        medications,
        dosage: dosage || '',
        duration: duration || '',
        instructions: instructions || '',
        status: 'Active',
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
      message: 'Prescription created successfully.',
      data: {
        id: prescription.id,
        prescriptionId: prescription.prescriptionId,
        patient: prescription.patient.user.name,
        doctor: prescription.doctor.user.name,
        medications: prescription.medications,
        status: prescription.status,
      },
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update prescription
 * PUT /api/prescriptions/:id
 * Access: Admin only
 */
const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { medications, dosage, duration, instructions, status } = req.body;

    // Find prescription
    const prescription = await prisma.prescription.findFirst({
      where: {
        OR: [{ id }, { prescriptionId: id }],
      },
    });

    if (!prescription) {
      return res.status(404).json({
        message: 'Prescription not found.',
      });
    }

    // Update prescription
    const updatedPrescription = await prisma.prescription.update({
      where: { id: prescription.id },
      data: {
        ...(medications && { medications }),
        ...(dosage !== undefined && { dosage }),
        ...(duration !== undefined && { duration }),
        ...(instructions !== undefined && { instructions }),
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
      message: 'Prescription updated successfully.',
      data: {
        id: updatedPrescription.id,
        prescriptionId: updatedPrescription.prescriptionId,
        patient: updatedPrescription.patient.user.name,
        doctor: updatedPrescription.doctor.user.name,
        medications: updatedPrescription.medications,
        status: updatedPrescription.status,
      },
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Delete prescription
 * DELETE /api/prescriptions/:id
 * Access: Admin only
 */
const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    // Find prescription
    const prescription = await prisma.prescription.findFirst({
      where: {
        OR: [{ id }, { prescriptionId: id }],
      },
    });

    if (!prescription) {
      return res.status(404).json({
        message: 'Prescription not found.',
      });
    }

    // Delete prescription
    await prisma.prescription.delete({
      where: { id: prescription.id },
    });

    return res.status(200).json({
      message: 'Prescription deleted successfully.',
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
};
