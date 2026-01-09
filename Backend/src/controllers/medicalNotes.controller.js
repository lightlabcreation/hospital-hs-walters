const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all medical notes
 * GET /api/medical-notes
 * Access: Admin - all, Doctor - own created, Patient - own only
 */
const getAllMedicalNotes = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
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

    // Type filter
    if (type) {
      where.type = type;
    }

    // Search filter
    if (search) {
      where.OR = [
        { noteId: { contains: search } },
        { preview: { contains: search } },
        { patient: { user: { name: { contains: search } } } },
      ];
    }

    const [notes, total] = await Promise.all([
      prisma.medicalNote.findMany({
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
      prisma.medicalNote.count({ where }),
    ]);

    // Format response
    const formattedNotes = notes.map((note) => ({
      id: note.id,
      noteId: note.noteId,
      patient: note.patient.user.name,
      patientId: note.patient.patientId,
      author: note.doctor.user.name,
      type: note.type,
      preview: note.preview,
      detail: note.detail,
      date: note.createdAt,
      time: new Date(note.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    }));

    return res.status(200).json({
      data: formattedNotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all medical notes error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Get medical note by ID
 * GET /api/medical-notes/:id
 */
const getMedicalNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.medicalNote.findFirst({
      where: {
        OR: [{ id }, { noteId: id }],
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

    if (!note) {
      return res.status(404).json({
        message: 'Medical note not found.',
      });
    }

    // Role-based access check
    if (req.user.role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: req.user.id },
      });
      if (!doctor || note.doctorId !== doctor.id) {
        return res.status(403).json({
          message: 'Access denied. This note was not created by you.',
        });
      }
    } else if (req.user.role === 'patient') {
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (!patient || note.patientId !== patient.id) {
        return res.status(403).json({
          message: 'Access denied. This is not your medical note.',
        });
      }
    }

    return res.status(200).json({
      id: note.id,
      noteId: note.noteId,
      patient: note.patient.user.name,
      patientId: note.patient.patientId,
      author: note.doctor.user.name,
      type: note.type,
      preview: note.preview,
      detail: note.detail,
      date: note.createdAt,
      time: new Date(note.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });
  } catch (error) {
    console.error('Get medical note by ID error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Create new medical note
 * POST /api/medical-notes
 * Access: Doctor only
 */
const createMedicalNote = async (req, res) => {
  try {
    const { patientId, type, preview, detail } = req.body;

    // Validation
    if (!patientId || !type || !detail) {
      return res.status(400).json({
        message: 'Patient, type, and detail are required.',
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

    // Generate note ID
    const year = new Date().getFullYear();
    const noteCount = await prisma.medicalNote.count();
    const noteId = `NOTE-${year}-${String(noteCount + 1).padStart(3, '0')}`;

    // Auto-generate preview if not provided
    const notePreview = preview || detail.substring(0, 100) + (detail.length > 100 ? '...' : '');

    // Create medical note
    const note = await prisma.medicalNote.create({
      data: {
        noteId,
        patientId: patient.id,
        doctorId: doctor.id,
        type,
        preview: notePreview,
        detail,
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
      message: 'Medical note created successfully.',
      data: {
        id: note.id,
        noteId: note.noteId,
        patient: note.patient.user.name,
        author: note.doctor.user.name,
        type: note.type,
        preview: note.preview,
      },
    });
  } catch (error) {
    console.error('Create medical note error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

/**
 * Update medical note
 * PUT /api/medical-notes/:id
 * Access: Doctor only (who created it)
 */
const updateMedicalNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, preview, detail } = req.body;

    // Find note
    const note = await prisma.medicalNote.findFirst({
      where: {
        OR: [{ id }, { noteId: id }],
      },
    });

    if (!note) {
      return res.status(404).json({
        message: 'Medical note not found.',
      });
    }

    // Check if doctor owns this note
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctor || note.doctorId !== doctor.id) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own notes.',
      });
    }

    // Update note
    const updatedNote = await prisma.medicalNote.update({
      where: { id: note.id },
      data: {
        ...(type && { type }),
        ...(preview !== undefined && { preview }),
        ...(detail && { detail }),
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
      message: 'Medical note updated successfully.',
      data: {
        id: updatedNote.id,
        noteId: updatedNote.noteId,
        patient: updatedNote.patient.user.name,
        author: updatedNote.doctor.user.name,
        type: updatedNote.type,
        preview: updatedNote.preview,
      },
    });
  } catch (error) {
    console.error('Update medical note error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  getAllMedicalNotes,
  getMedicalNoteById,
  createMedicalNote,
  updateMedicalNote,
};
