const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all patients
 * GET /api/patients
 * Access: Admin - all, Doctor - assigned only, Patient - own only, Receptionist/Billing - all
 */
const getAllPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    // Role-based filtering
    if (req.user.role === 'doctor') {
      // Doctor can only see assigned patients
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (doctor) {
        where.assignedDoctorId = doctor.id;
      } else {
        return res.status(200).json({ data: [], pagination: { total: 0 } });
      }
    } else if (req.user.role === 'patient') {
      // Patient can only see their own profile
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (patient) {
        where.id = patient.id;
      } else {
        return res.status(200).json({ data: [], pagination: { total: 0 } });
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { patientId: { contains: search } },
        { user: { name: { contains: search } } },
        { phone: { contains: search } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isActive: true,
            },
          },
          assignedDoctor: {
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
      prisma.patient.count({ where }),
    ]);

    // Format response
    const formattedPatients = patients.map((p) => ({
      id: p.id,
      patientId: p.patientId,
      name: p.user.name,
      email: p.user.email || p.email,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      address: p.address,
      bloodGroup: p.bloodGroup,
      history: p.history,
      lastVisit: p.lastVisit,
      assignedDoctor: p.assignedDoctor?.user?.name || null,
      isActive: p.user.isActive,
      createdAt: p.createdAt,
    }));

    return res.status(200).json({
      data: formattedPatients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get patient by ID
 * GET /api/patients/:id
 */
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id }, { patientId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
        assignedDoctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        appointments: {
          take: 5,
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found.',
      });
    }

    // Role-based access check
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (!doctor || patient.assignedDoctorId !== doctor.id) {
        return res.status(403).json({
          message: 'Access denied. This patient is not assigned to you.',
        });
      }
    } else if (req.user.role === 'patient') {
      if (patient.userId !== req.user.id) {
        return res.status(403).json({
          message: 'Access denied. You can only view your own profile.',
        });
      }
    }

    return res.status(200).json({
      id: patient.id,
      patientId: patient.patientId,
      name: patient.user.name,
      email: patient.user.email || patient.email,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      history: patient.history,
      lastVisit: patient.lastVisit,
      assignedDoctor: patient.assignedDoctor?.user?.name || null,
      recentAppointments: patient.appointments,
      createdAt: patient.createdAt,
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new patient
 * POST /api/patients
 * Access: Admin, Receptionist only
 */
const createPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      history,
      assignedDoctorId,
    } = req.body;

    // Validation
    if (!name || !email || !password || !age || !gender || !phone) {
      return res.status(400).json({
        message: 'Name, email, password, age, gender, and phone are required.',
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate patient ID
    const year = new Date().getFullYear();
    const patientCount = await prisma.patient.count();
    const patientId = `PAT-${year}-${String(patientCount + 1).padStart(3, '0')}`;

    // Create user and patient in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role: 'patient',
        },
      });

      const patient = await tx.patient.create({
        data: {
          patientId,
          userId: user.id,
          age: parseInt(age),
          gender,
          phone,
          email: email.toLowerCase(),
          address: address || '',
          bloodGroup: bloodGroup || '',
          history: history || '',
          assignedDoctorId: assignedDoctorId || null,
        },
      });

      return { user, patient };
    });

    return res.status(201).json({
      message: 'Patient created successfully.',
      data: {
        id: result.patient.id,
        patientId: result.patient.patientId,
        name: result.user.name,
        email: result.user.email,
        age: result.patient.age,
        gender: result.patient.gender,
        phone: result.patient.phone,
      },
    });
  } catch (error) {
    console.error('Create patient error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update patient
 * PUT /api/patients/:id
 * Access: Admin, Receptionist only
 */
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      history,
      assignedDoctorId,
    } = req.body;

    // Find patient
    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id }, { patientId: id }],
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found.',
      });
    }

    // Update patient and user in transaction
    await prisma.$transaction(async (tx) => {
      // Update user name if provided
      if (name) {
        await tx.user.update({
          where: { id: patient.userId },
          data: { name },
        });
      }

      // Update patient profile
      await tx.patient.update({
        where: { id: patient.id },
        data: {
          ...(age && { age: parseInt(age) }),
          ...(gender && { gender }),
          ...(phone && { phone }),
          ...(address !== undefined && { address }),
          ...(bloodGroup !== undefined && { bloodGroup }),
          ...(history !== undefined && { history }),
          ...(assignedDoctorId !== undefined && { assignedDoctorId }),
        },
      });
    });

    // Fetch updated patient
    const updatedPatient = await prisma.patient.findUnique({
      where: { id: patient.id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      message: 'Patient updated successfully.',
      data: {
        id: updatedPatient.id,
        patientId: updatedPatient.patientId,
        name: updatedPatient.user.name,
        email: updatedPatient.user.email,
        age: updatedPatient.age,
        gender: updatedPatient.gender,
        phone: updatedPatient.phone,
      },
    });
  } catch (error) {
    console.error('Update patient error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Delete patient
 * DELETE /api/patients/:id
 * Access: Admin only
 */
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Find patient
    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id }, { patientId: id }],
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found.',
      });
    }

    // Delete user (cascade will delete patient profile)
    await prisma.user.delete({
      where: { id: patient.userId },
    });

    return res.status(200).json({
      message: 'Patient deleted successfully.',
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
