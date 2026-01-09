# Hospital EMR System - Product Requirements Document (PRD) & Data Flow Architecture

## 1. Executive Summary
The Hospital EMR System is a role-based, paperless clinical management platform designed to streamline operations between Doctors, Staff, Patients, and Administrators. The system ensures secure data flow, real-time updates, and specific dashboard views for each stakeholder.

## 2. User Roles & Access Hierarchy

| Role | Access Level | Primary Dashboard | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Level 1 (Full) | `SuperAdminDashboard` | System configuration, Manage Clinics/Admins, Global Reporting, Audit Logs. |
| **Clinic Admin** | Level 2 | `AdminDashboard` | Manage Doctors, Staff, Schedules, Inventory, Clinic-level Reporting. |
| **Doctor** | Level 3 | `DoctorDashboard` | Consultations, Prescriptions, Lab Requests, View Patient History. |
| **Receptionist** | Level 3 | `ReceptionistDashboard` | Book Appointments, Patient Registration, Queue Management, Check-in/Check-out. |
| **Billing Staff** | Level 3 | `BillingDashboard` | Invoice Generation, Payment Processing, Insurance Claims. |
| **Patient** | Level 4 | `PatientDashboard` | View Appointments, View Prescriptions, Upload/Download Reports, View Bills. |

---

## 3. Data Flow & Logic Architecture

### 3.1. Clinical Consultation Flow (Doctor <-> Patient)
**Scenario**: Doctor consults a patient, prescribes meds, and requests lab tests.

1.  **Doctor Action** (`DoctorDashboard`):
    *   Selects Patient from "Appointment Roster".
    *   Opens "Start Consultation" Modal.
    *   Enters Clinical Notes (Symptoms, Diagnosis).
    *   **Prescription**: Adds medications via "Prescription Pad". -> *Saves to `Prescriptions` Table*.
    *   **Lab Request**: Selects tests (e.g., CBC, Thyroid) via "Lab Request" Modal. -> *Saves to `LabRequests` Table (Status: 'Pending')*.
2.  **Data Travel**:
    *   Backend updates `Appointment` status to 'Completed'.
    *   `Prescription` and `LabRequest` records are linked to `PatientID` and `DoctorID`.
3.  **Patient View** (`PatientDashboard`):
    *   **Prescriptions**: Read-only card shows new medications immediately.
    *   **Lab Requests**: "Prescribed Test Requests" table shows the new test (Status: 'Pending').

### 3.2. Lab Report Management Flow (Patient <-> Doctor)
**Scenario**: Patient performs the test externally and uploads the result for the Doctor.

1.  **Patient Action** (`PatientDashboard`):
    *   Navigates to "Prescribed Test Requests".
    *   Clicks **"Upload Report"** on the pending test.
    *   Uploads file (PDF/Image). -> *Updates `LabRequests` Table (Status: 'Uploaded', FileURL: 'path/to/file')*.
2.  **Data Travel**:
    *   System triggers notification/alert for the specific Doctor.
3.  **Doctor Action** (`DoctorDashboard`):
    *   "Queue Alerts" or "Recent Patient Uploads" section highlights the new file.
    *   Doctor clicks **"View"** or **"Download"** to analyze the report.
    *   (Optional) Doctor marks as "Reviewed" -> *Updates `LabRequests` status*.

### 3.3. Appointment & Registration Flow (Patient <-> Receptionist)
**Scenario**: New Patient walks in or requests appointment.

1.  **Registration** (`ReceptionistDashboard` or `PatientDashboard`):
    *   **Self-Service**: Patient uses "Book Appointment" modal -> *Creates `Appointment` Request (Status: 'Pending')*.
    *   **Walk-In**: Receptionist uses "New Patient" form -> *Creates `User/Patient` Record*.
2.  **Scheduling**:
    *   Receptionist views "Appointment Requests".
    *   Assigns Slot/Doctor based on availability. -> *Updates `Appointment` (Status: 'Scheduled')*.
3.  **Sync**:
    *   Doctor's "Today Slots" counter increments.
    *   Patient's "Upcoming Visits" card updates.

### 3.4. Billing & Payment Flow (Receptionist/Billing <-> Patient)
**Scenario**: Consultation done, payment due.

1.  **Initiation** (`BillingDashboard`):
    *   Billing Staff creates "New Invoice" linked to `PatientID` and `AppointmentID`.
    *   Adds items (Consultation Fee, Procedures). -> *Saves to `Invoices` Table*.
2.  **Patient View** (`PatientDashboard`):
    *   "Invoices Due" stat card updates.
    *   View Invoice details (Read-only).
3.  **Settlement**:
    *   Patient pays (Offline/Online).
    *   Billing Staff updates Invoice Status to 'Paid'. -> *Generates 'Receipt'*.

---

## 4. Dashboard Relationships & Data Models

### 4.1. Entity Relationships (ERD Concept)
*   **Users Table**: Stores Login Creds (Email/UserID, Password, Role).
    *   *One-to-One* with **DoctorProfile** / **StaffProfile** / **PatientProfile**.
*   **Appointments Table**:
    *   `id` (PK)
    *   `doctor_id` (FK -> Doctor)
    *   `patient_id` (FK -> Patient)
    *   `status` (Scheduled, Completed, Cancelled)
    *   `datetime`
*   **Prescriptions Table**:
    *   `id` (PK)
    *   `appointment_id` (FK)
    *   `patient_id` (FK)
    *   `medications` (JSON/Text)
    *   `instructions`
*   **LabRequests Table**:
    *   `id` (PK)
    *   `patient_id` (FK)
    *   `doctor_id` (FK)
    *   `test_name`
    *   `status` (Pending, Uploaded, Reviewed)
    *   `report_url`
*   **Invoices Table**:
    *   `id` (PK)
    *   `patient_id` (FK)
    *   `amount`
    *   `status` (Unpaid, Paid)

### 4.2. Cross-Dashboard Sync Logic
*   **Real-time Status References**:
    *   If a Doctor marks an appointment 'Complete', Billing Dashboard should see it in "Pending Billing" queue.
    *   If a Patient uploads a report, Doctor Dashboard must show a "New Result" indicator.
    *   If Super Admin deactivates a Doctor, their name is removed from Receptionist's "Booking" dropdown.

## 5. Security & Access Control
*   **Authentication**:
    *   **Super Admin**: Fixed/Database credentials.
    *   **Staff (Doctor/Reception/Billing)**: Created by Super/Clinic Admin. Credentials: `User ID` + `Password`.
    *   **Patient**: Created by Receptionist (Walk-in) or Self-Signup. Credentials: `Email/Phone` + `Password`.
*   **Authorization**:
    *   **Write Access**: Strictly role-bound (e.g., Patients cannot edit Prescriptions).
    *   **Read Access**: Scoped (e.g., Doctor sees only their patients or clinic-wide depending on policy; Patient sees ONLY their own data).

## 6. Functional Requirements Checklist

| Feature | Role | Status | Description |
| :--- | :--- | :--- | :--- |
| **Add Doctors/Staff** | Super Admin | ✅ Done | Create accounts with Role, UserID, Password. |
| **Patient Registration**| Reception | ✅ Done | Form with Med History, ID, Password. |
| **Book Appointment** | Patient/Rec | ✅ Done | Slot selection, Doctor selection. |
| **Write Rx** | Doctor | ✅ Done | Input meds, dosage, instructions. |
| **Request Lab Test** | Doctor | ✅ Done | Select tests, send request to patient. |
| **Upload Report** | Patient | ✅ Done | Upload file for requested test. |
| **View/DL Report** | Doctor | ✅ Done | Access patient uploaded files. |
| **Generate Invoice** | Billing | ✅ Done | Create bill, print receipt. |
