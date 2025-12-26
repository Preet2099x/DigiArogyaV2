# DigiArogya V2 🏥

DigiArogya V2 is a digital healthcare application for managing patient medical records with strict ownership, controlled access, and security-first design.

The system is intended for real-world use by patients and healthcare providers, where medical data is sensitive, access must be deliberate, and trust cannot be implicit.

At the core of DigiArogya is a consent-driven model: patient data is private by default and shared only when explicitly approved.

---

## 📌 Product Overview

DigiArogya enables patients to securely store their medical records and control how those records are shared with doctors and other healthcare providers.

Instead of relying on broad role-based access, the platform separates **data ownership** from **data access**. Patients remain the owners of their data, while providers operate only within permissions granted by patients.

The application is being developed as a full-stack product, with the backend implemented first and a frontend planned as the primary user interface.

---

## 👤 Accounts and Authentication

Each user creates an account using:
- 📧 Email
- 🔐 Password
- 🎭 A single role (PATIENT, DOCTOR, etc.)

An account represents one operational role. Permissions are not inferred beyond that role.

Users authenticate using email and password. After successful login, the backend issues a JWT token representing the authenticated user and their role. All protected API requests require this token.

---

## 🧑‍⚕️ Data Ownership and Access Control

### 🧍 Patient Ownership

All medical records belong to the patient.

Patients can:
- View their complete medical history
- Grant access to specific doctors
- Revoke access at any time

Patients never supply their own identifiers when accessing records. Ownership is derived from authentication to prevent misuse or data leakage.

---

### 🩺 Doctor Access

Doctors cannot access patient records by default.

A doctor may view a patient’s records only if:
- The patient has explicitly granted access
- The request is authenticated
- A valid access grant exists

Knowing or guessing a patient identifier does not provide access.

---

## 📁 Medical Records

Medical records are stored using a semi-structured model to balance flexibility and consistency.

Each record includes:
- 🏷️ Record type (e.g. diagnosis, prescription, lab report)
- 📝 Title or short description
- 📄 Record content (text or structured data)
- 👨‍⚕️ Information about the creator
- 🕒 Timestamps

This approach supports future validation, filtering, and system evolution without frequent schema changes.

---

## 🔒 Security Model

- 🔑 JWT-based authentication
- 🧠 Authorization enforced in the service layer
- 🎭 Roles trusted only from server-issued tokens
- 🚫 Controllers contain no business logic
- 🛑 Access denied by default unless explicitly allowed

All access decisions are explicit and auditable.

---

## 🛠️ Technology Stack

### Backend
- ☕ Java 21
- 🌱 Spring Boot
- 🌐 Spring Web
- 🗄️ Spring Data JPA
- 🔐 Spring Security (JWT)
- 🐘 PostgreSQL
- 📦 Maven

### Frontend
- ⚛️ React (planned)
- 🔑 Token-based API communication

---

## ✅ Current Functionality

- User registration with strict role validation
- Secure login with password hashing
- JWT authentication
- Role-aware authorization
- Patient-only access to own records
- Doctor access gated by patient approval
- Structured error handling
- Layered backend architecture

---

## 🚀 Planned Work

- Doctors creating medical records
- Revoking and expiring access grants
- Patient dashboards
- Audit logging
- Record filtering and categorization
- File and report uploads
- Complete frontend workflows

---

## 🎯 Scope

DigiArogya V2 is being built as a real healthcare application, with a backend designed to support privacy, controlled data sharing, and long-term product growth.
