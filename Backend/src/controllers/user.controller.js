const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get logged-in user profile
 * GET /api/users/me
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        patient: {
          select: {
            patientId: true,
            age: true,
            gender: true,
            phone: true,
            bloodGroup: true,
          },
        },
        doctor: {
          select: {
            doctorId: true,
            department: true,
            specialization: true,
            phone: true,
          },
        },
        staff: {
          select: {
            staffId: true,
            jobRole: true,
            shift: true,
            phone: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    // Format response based on role
    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Add role-specific profile data
    if (user.patient) {
      response.profile = user.patient;
    } else if (user.doctor) {
      response.profile = user.doctor;
    } else if (user.staff) {
      response.profile = user.staff;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    // Filter by role if provided
    if (role) {
      where.role = role;
    }

    // Search by name or email
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          doctor: {
            select: {
              id: true,
              doctorId: true,
              department: true,
              specialization: true,
              phone: true,
              availability: true,
            },
          },
          staff: {
            select: {
              id: true,
              staffId: true,
              jobRole: true,
              shift: true,
              phone: true,
            },
          },
          patient: {
            select: {
              id: true,
              patientId: true,
              age: true,
              gender: true,
              phone: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        patient: true,
        doctor: true,
        staff: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new user (Admin only)
 * POST /api/users
 * Allowed roles to create: doctor, receptionist, billing_staff, patient
 */
const createUser = async (req, res) => {
  try {
    const { email, password, name, role, profileData } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        message: 'Email, password, name, and role are required.',
      });
    }

    // Validate role - cannot create super_admin
    const allowedRoles = ['doctor', 'receptionist', 'billing_staff', 'patient'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
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

    // Generate unique IDs based on role
    const timestamp = Date.now().toString().slice(-3);
    const year = new Date().getFullYear();

    // Create user with role-specific profile in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role,
        },
      });

      // Create role-specific profile
      if (role === 'patient') {
        const patientCount = await tx.patient.count();
        await tx.patient.create({
          data: {
            patientId: `PAT-${year}-${String(patientCount + 1).padStart(3, '0')}`,
            userId: user.id,
            age: profileData?.age || 0,
            gender: profileData?.gender || 'Not specified',
            phone: profileData?.phone || '',
            email: user.email,
            address: profileData?.address || '',
            bloodGroup: profileData?.bloodGroup || '',
            history: profileData?.history || '',
          },
        });
      } else if (role === 'doctor') {
        const doctorCount = await tx.doctor.count();
        await tx.doctor.create({
          data: {
            doctorId: `DOC-${year}-${String(doctorCount + 1).padStart(3, '0')}`,
            userId: user.id,
            department: profileData?.department || 'General',
            specialization: profileData?.specialization || '',
            qualifications: profileData?.qualifications || '',
            experience: profileData?.experience || '',
            phone: profileData?.phone || '',
            availability: profileData?.availability || 'Mon-Fri',
          },
        });
      } else if (role === 'receptionist' || role === 'billing_staff') {
        const staffCount = await tx.staff.count();
        await tx.staff.create({
          data: {
            staffId: `STF-${year}-${String(staffCount + 1).padStart(3, '0')}`,
            userId: user.id,
            jobRole: role === 'receptionist' ? 'Receptionist' : 'Billing Manager',
            shift: profileData?.shift || 'Day (09-06)',
            phone: profileData?.phone || '',
            joinedAt: new Date(),
          },
        });
      }

      return user;
    });

    // Fetch created user with profile
    const createdUser = await prisma.user.findUnique({
      where: { id: result.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        patient: true,
        doctor: true,
        staff: true,
      },
    });

    return res.status(201).json({
      message: 'User created successfully.',
      data: createdUser,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update user (Admin only)
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isActive, password, profileData } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Update role-specific profile if profileData provided
    if (profileData) {
      if (existingUser.role === 'patient') {
        await prisma.patient.update({
          where: { userId: parseInt(id) },
          data: profileData,
        });
      } else if (existingUser.role === 'doctor') {
        await prisma.doctor.update({
          where: { userId: parseInt(id) },
          data: profileData,
        });
      } else if (existingUser.role === 'receptionist' || existingUser.role === 'billing_staff') {
        await prisma.staff.update({
          where: { userId: parseInt(id) },
          data: profileData,
        });
      }
    }

    return res.status(200).json({
      message: 'User updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    // Prevent deleting super_admin
    if (existingUser.role === 'super_admin') {
      return res.status(403).json({
        message: 'Cannot delete super admin account.',
      });
    }

    // Prevent self-deletion
    if (existingUser.id === req.user.id) {
      return res.status(403).json({
        message: 'Cannot delete your own account.',
      });
    }

    // Delete user (cascade will delete related profile)
    const idInt = parseInt(id); // define for clarity if needed, or just inline
    await prisma.user.delete({
      where: { id: idInt },
    });

    return res.status(200).json({
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
