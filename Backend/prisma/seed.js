const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password', 10);

  // ============================================
  // Create Super Admin
  // ============================================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@clinic.com' },
    update: {},
    create: {
      email: 'admin@clinic.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin',
    },
  });
  console.log('Created Super Admin:', adminUser.email);

  // ============================================
  // Create Doctors
  // ============================================
  const doctor1User = await prisma.user.upsert({
    where: { email: 'doctor@clinic.com' },
    update: {},
    create: {
      email: 'doctor@clinic.com',
      password: hashedPassword,
      name: 'Dr. John Smith',
      role: 'doctor',
    },
  });

  const doctor1 = await prisma.doctor.upsert({
    where: { userId: doctor1User.id },
    update: {},
    create: {
      doctorId: 'DOC-2026-001',
      userId: doctor1User.id,
      department: 'Cardiology',
      specialization: 'Heart Specialist',
      qualifications: 'MBBS, MD (Cardiology)',
      experience: '12 Years',
      phone: '+1 555-0101',
      availability: 'Mon, Wed, Fri',
    },
  });
  console.log('Created Doctor:', doctor1User.email);

  const doctor2User = await prisma.user.upsert({
    where: { email: 'emily@clinic.com' },
    update: {},
    create: {
      email: 'emily@clinic.com',
      password: hashedPassword,
      name: 'Dr. Emily Wilson',
      role: 'doctor',
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { userId: doctor2User.id },
    update: {},
    create: {
      doctorId: 'DOC-2026-002',
      userId: doctor2User.id,
      department: 'Pediatrics',
      specialization: 'Child Specialist',
      qualifications: 'MBBS, DCH',
      experience: '8 Years',
      phone: '+1 555-0102',
      availability: 'Tue, Thu, Sat',
    },
  });
  console.log('Created Doctor:', doctor2User.email);

  // ============================================
  // Create Receptionist
  // ============================================
  const receptionistUser = await prisma.user.upsert({
    where: { email: 'receptionist@clinic.com' },
    update: {},
    create: {
      email: 'receptionist@clinic.com',
      password: hashedPassword,
      name: 'Alice Johnson',
      role: 'receptionist',
    },
  });

  await prisma.staff.upsert({
    where: { userId: receptionistUser.id },
    update: {},
    create: {
      staffId: 'STF-2026-001',
      userId: receptionistUser.id,
      jobRole: 'Receptionist',
      shift: 'Morning (09-02)',
      phone: '+1 555-0201',
      joinedAt: new Date('2024-05-10'),
    },
  });
  console.log('Created Receptionist:', receptionistUser.email);

  // ============================================
  // Create Billing Staff
  // ============================================
  const billingUser = await prisma.user.upsert({
    where: { email: 'billing@clinic.com' },
    update: {},
    create: {
      email: 'billing@clinic.com',
      password: hashedPassword,
      name: 'Robert Fox',
      role: 'billing_staff',
    },
  });

  await prisma.staff.upsert({
    where: { userId: billingUser.id },
    update: {},
    create: {
      staffId: 'STF-2026-002',
      userId: billingUser.id,
      jobRole: 'Billing Manager',
      shift: 'Day (10-06)',
      phone: '+1 555-0202',
      joinedAt: new Date('2023-11-20'),
    },
  });
  console.log('Created Billing Staff:', billingUser.email);

  // ============================================
  // Create Patients
  // ============================================
  const patient1User = await prisma.user.upsert({
    where: { email: 'patient@clinic.com' },
    update: {},
    create: {
      email: 'patient@clinic.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'patient',
    },
  });

  const patient1 = await prisma.patient.upsert({
    where: { userId: patient1User.id },
    update: {},
    create: {
      patientId: 'PAT-2026-001',
      userId: patient1User.id,
      age: 34,
      gender: 'Male',
      phone: '+1 555-0301',
      email: 'patient@clinic.com',
      address: '123 Main Street, City',
      bloodGroup: 'O+',
      history: 'No major allergies. Routine checkup.',
      assignedDoctorId: doctor1.id,
    },
  });
  console.log('Created Patient:', patient1User.email);

  const patient2User = await prisma.user.upsert({
    where: { email: 'jane@clinic.com' },
    update: {},
    create: {
      email: 'jane@clinic.com',
      password: hashedPassword,
      name: 'Jane Roe',
      role: 'patient',
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { userId: patient2User.id },
    update: {},
    create: {
      patientId: 'PAT-2026-002',
      userId: patient2User.id,
      age: 28,
      gender: 'Female',
      phone: '+1 555-0302',
      email: 'jane@clinic.com',
      address: '456 Oak Avenue, Town',
      bloodGroup: 'A+',
      history: 'Allergic to penicillin.',
      assignedDoctorId: doctor2.id,
    },
  });
  console.log('Created Patient:', patient2User.email);

  const patient3User = await prisma.user.upsert({
    where: { email: 'mike@clinic.com' },
    update: {},
    create: {
      email: 'mike@clinic.com',
      password: hashedPassword,
      name: 'Mike Ross',
      role: 'patient',
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { userId: patient3User.id },
    update: {},
    create: {
      patientId: 'PAT-2026-003',
      userId: patient3User.id,
      age: 45,
      gender: 'Male',
      phone: '+1 555-0303',
      email: 'mike@clinic.com',
      address: '789 Pine Road, Village',
      bloodGroup: 'B+',
      history: 'Diabetic. Regular medication.',
      assignedDoctorId: doctor1.id,
    },
  });
  console.log('Created Patient:', patient3User.email);

  // ============================================
  // Create Sample Appointments
  // ============================================
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.appointment.createMany({
    data: [
      {
        appointmentId: 'APT-2026-001',
        patientId: patient1.id,
        doctorId: doctor1.id,
        date: today,
        time: '10:00 AM',
        status: 'Scheduled',
        type: 'Offline',
        reason: 'Regular Checkup',
      },
      {
        appointmentId: 'APT-2026-002',
        patientId: patient2.id,
        doctorId: doctor2.id,
        date: today,
        time: '10:30 AM',
        status: 'Completed',
        type: 'Online',
        reason: 'Fever & Cold',
      },
      {
        appointmentId: 'APT-2026-003',
        patientId: patient3.id,
        doctorId: doctor1.id,
        date: today,
        time: '11:00 AM',
        status: 'Scheduled',
        type: 'Offline',
        reason: 'Follow-up',
      },
      {
        appointmentId: 'APT-2026-004',
        patientId: patient1.id,
        doctorId: doctor1.id,
        date: tomorrow,
        time: '09:00 AM',
        status: 'Scheduled',
        type: 'Offline',
        reason: 'Blood Test Review',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Created sample appointments');

  // ============================================
  // Create Sample Prescriptions
  // ============================================
  await prisma.prescription.createMany({
    data: [
      {
        prescriptionId: 'PRE-2026-001',
        patientId: patient1.id,
        doctorId: doctor1.id,
        medications: 'Amoxicillin, Paracetamol',
        dosage: '500mg, 1 twice daily',
        duration: '5 days',
        instructions: 'Take after meals',
        status: 'Active',
      },
      {
        prescriptionId: 'PRE-2026-002',
        patientId: patient2.id,
        doctorId: doctor2.id,
        medications: 'Ibuprofen',
        dosage: '400mg, 1 as needed',
        duration: '3 days',
        instructions: 'Do not exceed 3/day',
        status: 'Completed',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Created sample prescriptions');

  // ============================================
  // Create Sample Lab Results
  // ============================================
  await prisma.labResult.createMany({
    data: [
      {
        labId: 'LAB-2026-001',
        patientId: patient1.id,
        doctorId: doctor1.id,
        testName: 'Full Blood Count (CBC)',
        findings: 'All parameters within normal range except Hemoglobin (13.2 g/dL).',
        results: { hgb: 13.2, wbc: 7500, plt: 250000 },
        technician: 'Alice Wong',
        status: 'Final',
      },
      {
        labId: 'LAB-2026-002',
        patientId: patient2.id,
        doctorId: doctor2.id,
        testName: 'Lipid Profile',
        findings: 'Processing in progress...',
        results: null,
        technician: 'Bob Miller',
        status: 'Pending',
      },
      {
        labId: 'LAB-2026-003',
        patientId: patient3.id,
        doctorId: doctor1.id,
        testName: 'Thyroid Function (T3/T4/TSH)',
        findings: 'Elevated TSH levels detected (6.2 µIU/mL). Possible hypothyroidism.',
        results: { t3: 100, t4: 8.5, tsh: 6.2 },
        technician: 'Alice Wong',
        status: 'Final',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Created sample lab results');

  // ============================================
  // Create Sample Medical Notes
  // ============================================
  await prisma.medicalNote.createMany({
    data: [
      {
        noteId: 'NOTE-2026-001',
        patientId: patient1.id,
        doctorId: doctor1.id,
        type: 'Clinical Consultation',
        preview: 'Patient presented with mild fever and persistent cough for 3 days.',
        detail: 'Patient John Doe (34M) came in complaining of a dry cough. O2 Sat: 98%, Temp: 100.2F. Lungs are clear on auscultation. No history of pneumonia.',
      },
      {
        noteId: 'NOTE-2026-002',
        patientId: patient2.id,
        doctorId: doctor2.id,
        type: 'Surgical Follow-up',
        preview: 'Post-operative recovery is progressing well. Stitches checked and healthy.',
        detail: 'Post-op Day 14. Appendectomy wound is healing well. No signs of infection (redness/discharge). Patient is advised to resume light walking.',
      },
      {
        noteId: 'NOTE-2026-003',
        patientId: patient3.id,
        doctorId: doctor1.id,
        type: 'Chronic Progress',
        preview: 'Blood pressure stabilized at 130/85. Continuing current regimen.',
        detail: 'Hypertension management. BP today 130/85 mmHg. Heart rate 72 bpm. Patient compliant with Amlodipine 5mg. No side effects reported.',
      },
    ],
    skipDuplicates: true,
  });
  console.log('Created sample medical notes');

  // ============================================
  // Create Sample Invoices
  // ============================================
  const dueDate1 = new Date();
  dueDate1.setDate(dueDate1.getDate() + 10);
  const dueDate2 = new Date();
  dueDate2.setDate(dueDate2.getDate() + 14);
  const dueDate3 = new Date();
  dueDate3.setDate(dueDate3.getDate() - 3);

  await prisma.invoice.createMany({
    data: [
      {
        invoiceId: 'INV-2026-001',
        patientId: patient1.id,
        amount: 5000,
        status: 'Paid',
        dueDate: dueDate1,
        method: 'Cash',
        items: [{ desc: 'Consultation', price: 1000 }, { desc: 'Lab Test', price: 4000 }],
      },
      {
        invoiceId: 'INV-2026-002',
        patientId: patient2.id,
        amount: 12500,
        status: 'Pending',
        dueDate: dueDate2,
        method: 'Insurance',
        items: [{ desc: 'MRI Scan', price: 12500 }],
      },
      {
        invoiceId: 'INV-2026-003',
        patientId: patient3.id,
        amount: 3500,
        status: 'Overdue',
        dueDate: dueDate3,
        method: 'UPI',
        items: [{ desc: 'X-Ray', price: 2000 }, { desc: 'Emergency', price: 1500 }],
      },
    ],
    skipDuplicates: true,
  });
  console.log('Created sample invoices');

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Super Admin:  admin@clinic.com / password');
  console.log('Doctor:       doctor@clinic.com / password');
  console.log('Receptionist: receptionist@clinic.com / password');
  console.log('Billing:      billing@clinic.com / password');
  console.log('Patient:      patient@clinic.com / password');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
