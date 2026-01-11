const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all appointments
 * GET /api/appointments
 * Access: Admin/Receptionist - all, Doctor - their appointments, Patient - own only
 */
const getAllAppointments = async (req, res) => {
  try {
    const { search, status, date, page = 1, limit = 20 } = req.query;
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

    // Date filter
    if (date) {
      const searchDate = new Date(date);
      where.date = {
        gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        lt: new Date(searchDate.setHours(23, 59, 59, 999)),
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { appointmentId: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
        { doctor: { user: { name: { contains: search } } } },
      ];
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
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
        orderBy: [{ date: 'desc' }, { time: 'asc' }],
      }),
      prisma.appointment.count({ where }),
    ]);

    // Format response
    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      appointmentId: apt.appointmentId,
      patient: apt.patient.user.name,
      patientId: apt.patient.patientId,
      doctor: apt.doctor.user.name,
      doctorId: apt.doctor.doctorId,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      type: apt.type,
      reason: apt.reason,
      createdAt: apt.createdAt,
    }));

    return res.status(200).json({
      data: formattedAppointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get appointment by ID
 * GET /api/appointments/:id
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const queryId = parseInt(id);
    const whereCondition = isNaN(queryId)
      ? { appointmentId: id }
      : { OR: [{ id: queryId }, { appointmentId: id }] };

    const appointment = await prisma.appointment.findFirst({
      where: whereCondition,
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

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.',
      });
    }

    // Role-based access check
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (!doctor || appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          message: 'Access denied. This appointment is not assigned to you.',
        });
      }
    } else if (req.user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (!patient || appointment.patientId !== patient.id) {
        return res.status(403).json({
          message: 'Access denied. This is not your appointment.',
        });
      }
    }

    return res.status(200).json({
      id: appointment.id,
      appointmentId: appointment.appointmentId,
      patient: appointment.patient.user.name,
      patientId: appointment.patient.patientId,
      patientPhone: appointment.patient.phone,
      doctor: appointment.doctor.user.name,
      doctorId: appointment.doctor.doctorId,
      department: appointment.doctor.department,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      type: appointment.type,
      reason: appointment.reason,
      createdAt: appointment.createdAt,
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new appointment
 * POST /api/appointments
 * Access: Admin, Doctor, Receptionist
 */
const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, type, reason } = req.body;

    // Validation
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        message: 'Patient, doctor, date, and time are required.',
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

    // Find doctor
    const doctorQueryId = parseInt(doctorId);
    const doctorWhere = isNaN(doctorQueryId)
      ? { doctorId: doctorId }
      : { OR: [{ id: doctorQueryId }, { doctorId: doctorId }] };

    const doctor = await prisma.doctor.findFirst({
      where: doctorWhere,
    });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found.',
      });
    }

    // Generate appointment ID
    const year = new Date().getFullYear();
    const appointmentCount = await prisma.appointment.count();
    const appointmentId = `APT-${year}-${String(appointmentCount + 1).padStart(3, '0')}`;

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        appointmentId,
        patientId: patient.id,
        doctorId: doctor.id,
        date: new Date(date),
        time,
        type: type || 'Offline',
        reason: reason || '',
        status: 'Scheduled',
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

    // Update patient's last visit
    await prisma.patient.update({
      where: { id: patient.id },
      data: { lastVisit: new Date() },
    });

    return res.status(201).json({
      message: 'Appointment created successfully.',
      data: {
        id: appointment.id,
        appointmentId: appointment.appointmentId,
        patient: appointment.patient.user.name,
        doctor: appointment.doctor.user.name,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        type: appointment.type,
      },
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update appointment
 * PUT /api/appointments/:id
 * Access: Admin, Doctor, Receptionist
 */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, status, type, reason } = req.body;

    // Find appointment
    const queryId = parseInt(id);
    const whereCondition = isNaN(queryId)
      ? { appointmentId: id }
      : { OR: [{ id: queryId }, { appointmentId: id }] };

    const appointment = await prisma.appointment.findFirst({
      where: whereCondition,
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.',
      });
    }

    // Role-based access check for doctors
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (!doctor || appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          message: 'Access denied. This appointment is not assigned to you.',
        });
      }
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(status && { status }),
        ...(type && { type }),
        ...(reason !== undefined && { reason }),
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
      message: 'Appointment updated successfully.',
      data: {
        id: updatedAppointment.id,
        appointmentId: updatedAppointment.appointmentId,
        patient: updatedAppointment.patient.user.name,
        doctor: updatedAppointment.doctor.user.name,
        date: updatedAppointment.date,
        time: updatedAppointment.time,
        status: updatedAppointment.status,
        type: updatedAppointment.type,
      },
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Delete appointment
 * DELETE /api/appointments/:id
 * Access: Admin, Receptionist
 */
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment
    const queryId = parseInt(id);
    const whereCondition = isNaN(queryId)
      ? { appointmentId: id }
      : { OR: [{ id: queryId }, { appointmentId: id }] };

    const appointment = await prisma.appointment.findFirst({
      where: whereCondition,
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found.',
      });
    }

    // Delete appointment
    await prisma.appointment.delete({
      where: { id: appointment.id },
    });

    return res.status(200).json({
      message: 'Appointment deleted successfully.',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get doctor's schedule (available slots)
 * GET /api/appointments/schedule/:doctorId
 */
const getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    // Find doctor
    const queryId = parseInt(doctorId);
    const whereCondition = isNaN(queryId)
      ? { doctorId: doctorId }
      : { OR: [{ id: queryId }, { doctorId: doctorId }] };

    const doctor = await prisma.doctor.findFirst({
      where: whereCondition,
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: 'Doctor not found.',
      });
    }

    // Get appointments for the date
    let where = { doctorId: doctor.id };
    if (date) {
      const searchDate = new Date(date);
      where.date = {
        gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        lt: new Date(searchDate.setHours(23, 59, 59, 999)),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      select: {
        time: true,
        status: true,
      },
      orderBy: { time: 'asc' },
    });

    return res.status(200).json({
      doctor: doctor.user.name,
      doctorId: doctor.doctorId,
      department: doctor.department,
      availability: doctor.availability,
      bookedSlots: appointments,
    });
  } catch (error) {
    console.error('Get doctor schedule error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorSchedule,
};
