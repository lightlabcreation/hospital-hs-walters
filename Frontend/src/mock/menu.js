import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiActivity,
  FiClipboard,
  FiFolder,
} from 'react-icons/fi'

// Menu configuration based on roles - Digital Clinic EMR System
export const menuConfig = {
  super_admin: [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Patients', path: '/patients', icon: FiUsers },
    { label: 'Appointments', path: '/appointments', icon: FiCalendar },
    { label: 'Doctors & Staff', path: '/staff', icon: FiUsers },
    { label: 'Prescriptions', path: '/prescriptions', icon: FiFileText },
    { label: 'Billing & Insurance', path: '/billing', icon: FiDollarSign },
    { label: 'Reports', path: '/reports', icon: FiBarChart2 },
    { label: 'Settings', path: '/settings', icon: FiSettings },
    { label: 'Support', path: '/support', icon: FiHelpCircle },
  ],
  doctor: [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'My Patients', path: '/my-patients', icon: FiUsers },
    { label: 'My Appointments', path: '/my-appointments', icon: FiCalendar },
    { label: 'Prescriptions', path: '/prescriptions', icon: FiFileText },
    { label: 'Lab Results', path: '/lab-results', icon: FiActivity },
    { label: 'Medical Notes', path: '/medical-notes', icon: FiClipboard },
    { label: 'Reports', path: '/reports', icon: FiBarChart2 },
  ],
  receptionist: [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Patients', path: '/patients', icon: FiUsers },
    { label: 'Appointments', path: '/appointments', icon: FiCalendar },
    { label: 'Doctor Schedule', path: '/doctor-schedule', icon: FiCalendar },
  ],
  billing_staff: [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Billing & Insurance', path: '/billing', icon: FiDollarSign },
    { label: 'Patient Invoices', path: '/invoices', icon: FiFileText },
    { label: 'Payment Records', path: '/payments', icon: FiDollarSign },
    { label: 'Financial Reports', path: '/reports', icon: FiBarChart2 },
  ],
  patient: [
    { label: 'My Appointments', path: '/my-appointments', icon: FiCalendar },
    { label: 'My Prescriptions', path: '/my-prescriptions', icon: FiFileText },
    { label: 'My Lab Reports', path: '/my-lab-reports', icon: FiActivity },
    { label: 'Billing History', path: '/billing-history', icon: FiDollarSign },
  ],
}

