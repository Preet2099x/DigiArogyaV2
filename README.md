<p align="center">
  <h1 align="center">🏥 DigiArogya V2</h1>
  <p align="center">
    <strong>A Secure, Consent-Driven Digital Health Records Management System</strong>
  </p>
  <p align="center">
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-security">Security</a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.12-brightgreen?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/JWT-Auth-red?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Principles](#-key-principles)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🎯 Overview

**DigiArogya** (Digital Health) is a comprehensive electronic health records (EHR) management system designed for real-world use by patients and healthcare providers. The platform implements a **consent-driven model** where patient data is private by default and shared only when explicitly approved.

### The Problem

Traditional healthcare systems often give broad access to patient data based on roles alone, creating privacy risks and making it difficult for patients to control who sees their sensitive medical information.

### Our Solution

DigiArogya separates **data ownership** from **data access**:
- 🔒 **Patients own their data** - Complete control over medical records
- ✅ **Explicit consent required** - Doctors can only access records when granted permission
- ⏰ **Time-limited access** - Access grants expire automatically (30 days)
- 📝 **Audit trail** - All access is logged and traceable

---

## 💡 Key Principles

| Principle | Description |
|-----------|-------------|
| **Privacy by Default** | No one can access patient data without explicit permission |
| **Patient Sovereignty** | Patients control who sees their records and for how long |
| **Minimal Trust** | System doesn't assume trust based on roles alone |
| **Explicit Authorization** | Every access decision is deliberate and auditable |
| **Defense in Depth** | Multiple security layers protect sensitive data |

---

## ✨ Features

### 👤 For Patients
| Feature | Description |
|---------|-------------|
| 📝 **View Records** | Access complete medical history with pagination (newest first) |
| 🔐 **Grant Access** | Allow specific doctors to view records for 30 days |
| 🚫 **Revoke Access** | Remove doctor access at any time |
| 📊 **Record Types** | View lab results, prescriptions, imaging, diagnoses, and more |

### 👨‍⚕️ For Doctors
| Feature | Description |
|---------|-------------|
| 📋 **Create Records** | Add medical records for authorized patients |
| 👁️ **View Patient History** | Access patient records (with consent) |
| 🏷️ **Categorize Records** | Classify by type: NOTE, DIAGNOSIS, PRESCRIPTION, LAB_RESULT, IMAGING, VITALS, PROCEDURE |

### 🔒 Security Features
- ✅ JWT-based stateless authentication
- ✅ BCrypt password hashing (strength 10)
- ✅ Role-based access control (RBAC)
- ✅ Patient-controlled data sharing
- ✅ Automatic access expiration
- ✅ Comprehensive error handling

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 21 | Core programming language |
| **Spring Boot** | 3.4.12 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | Database ORM |
| **PostgreSQL** | 16+ | Relational database |
| **JWT (jjwt)** | 0.11.5 | Token-based authentication |
| **Maven** | 3.9+ | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI framework |
| **Vite** | 7.2 | Build tool & dev server |
| **ESLint** | 9.x | Code quality |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                    │
│                    (React Frontend / Postman)                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTP/REST + JWT
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       SPRING BOOT APPLICATION                            │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      SECURITY LAYER                                │  │
│  │  ┌─────────────┐    ┌──────────────┐    ┌───────────────────────┐ │  │
│  │  │  JwtFilter  │───▶│   JwtUtil    │───▶│   SecurityConfig      │ │  │
│  │  │ (Intercept) │    │ (Parse/Gen)  │    │   (RBAC Rules)        │ │  │
│  │  └─────────────┘    └──────────────┘    └───────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      CONTROLLER LAYER                              │  │
│  │  ┌─────────────────┐              ┌─────────────────────────────┐ │  │
│  │  │ UserController  │              │     RecordController        │ │  │
│  │  │ POST /users     │              │ GET  /records/me            │ │  │
│  │  │ POST /users/login              │ GET  /records/{patientId}   │ │  │
│  │  └─────────────────┘              │ POST /records/{patientId}   │ │  │
│  │                                   │ POST /records/access        │ │  │
│  │                                   └─────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                       SERVICE LAYER                                │  │
│  │  ┌─────────────────┐              ┌─────────────────────────────┐ │  │
│  │  │   UserService   │              │      RecordService          │ │  │
│  │  │ - createUser()  │              │ - getMyRecords()            │ │  │
│  │  │ - login()       │              │ - getPatientRecordsForDoctor│ │  │
│  │  │ - validateRole()│              │ - grantAccess()             │ │  │
│  │  └─────────────────┘              │ - addRecord()               │ │  │
│  │                                   └─────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      REPOSITORY LAYER                              │  │
│  │  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────┐   │  │
│  │  │UserRepository│  │PatientRecordRepo │  │  AccessRepository  │   │  │
│  │  └──────────────┘  └──────────────────┘  └────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL DATABASE                              │
│    ┌──────────┐      ┌─────────────────┐      ┌──────────────────┐     │
│    │  users   │──────│ patient_records │      │      access      │     │
│    └──────────┘      └─────────────────┘      └──────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Java 21** or higher ([Download](https://adoptium.net/))
- **PostgreSQL 16+** ([Download](https://www.postgresql.org/download/))
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** (for frontend) ([Download](https://nodejs.org/))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/DigiArogyaV2.git
cd DigiArogyaV2
```

### 2️⃣ Setup Database

```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE digiarogya;
```

### 3️⃣ Configure Application

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/digiarogya
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 4️⃣ Run Backend

```bash
cd backend

# Using Maven Wrapper (recommended)
./mvnw spring-boot:run

# Or using Maven directly
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

### 5️⃣ Run Frontend (Optional)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

---

## 📚 API Reference

### Base URL
```
http://localhost:8080/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "PATIENT"
}
```

**Available Roles:** `PATIENT`, `DOCTOR`, `HOSPITAL`, `PHARMACY`, `AMBULANCE`, `LAB`, `INSURANCE`, `ADMIN`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PATIENT"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "userId": 1,
  "name": "John Doe",
  "role": "PATIENT"
}
```

---

### 📋 Records Endpoints

#### Get My Records (Patient Only)
```http
GET /api/records/me?page=0&size=10
Authorization: Bearer <patient_token>
```

**Query Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 0 | Page number (0-indexed) |
| `size` | 10 | Records per page |

**Response (200 OK):**
```json
{
  "records": [
    {
      "id": 15,
      "type": "PRESCRIPTION",
      "title": "Blood Pressure Medication",
      "content": "Amlodipine 5mg daily",
      "diagnosis": "Hypertension",
      "createdAt": "2025-12-30T05:55:45.566639Z",
      "createdByDoctorId": 8,
      "createdByDoctorName": "Dr. Smith"
    }
  ],
  "currentPage": 0,
  "totalPages": 1,
  "totalElements": 1,
  "pageSize": 10,
  "hasNext": false,
  "hasPrevious": false
}
```

#### Get Patient Records (Doctor Only)
```http
GET /api/records/{patientId}?page=0&size=10
Authorization: Bearer <doctor_token>
```

> ⚠️ Requires active access grant from patient

#### Grant Access to Doctor (Patient Only)
```http
POST /api/records/access
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "doctorEmail": "doctor@example.com"
}
```

> ✅ Access is granted for 30 days. Re-granting refreshes the expiration.

#### Create Record (Doctor Only)
```http
POST /api/records/{patientId}
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "type": "PRESCRIPTION",
  "title": "Antibiotic Course",
  "content": "Amoxicillin 500mg 3x daily for 7 days",
  "diagnosis": "Bacterial Infection"
}
```

**Record Types:**
| Type | Description |
|------|-------------|
| `NOTE` | General clinical notes |
| `DIAGNOSIS` | Medical diagnosis |
| `PRESCRIPTION` | Medication prescription |
| `LAB_RESULT` | Laboratory test results |
| `IMAGING` | X-rays, MRI, CT scans |
| `VITALS` | Blood pressure, heart rate, etc. |
| `PROCEDURE` | Surgical or medical procedures |

---

### ❌ Error Responses

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `ValidationException` | Invalid request data |
| 401 | `InvalidCredentialsException` | Wrong email/password |
| 401 | `Unauthorized` | Missing or invalid JWT |
| 403 | `AccessDeniedException` | Role not permitted for action |
| 403 | `AccessRequiredException` | Doctor needs patient permission |
| 409 | `DuplicateEmailException` | Email already registered |

**Error Response Format:**
```json
{
  "timestamp": "2025-12-30T06:00:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Active access required from patient",
  "path": "/api/records/7"
}
```

---

## 🗄️ Database Schema

```
┌──────────────────────┐       ┌──────────────────────────────┐
│       users          │       │      patient_records         │
├──────────────────────┤       ├──────────────────────────────┤
│ id (PK)              │       │ id (PK)                      │
│ name                 │       │ patient_id                   │
│ email (UNIQUE)       │       │ created_by_doctor_id (FK)────┼──┐
│ password (hashed)    │       │ type (ENUM)                  │  │
│ role (ENUM)          │       │ title                        │  │
└──────────┬───────────┘       │ content (TEXT)               │  │
           │                   │ diagnosis                    │  │
           │                   │ created_at                   │  │
           │                   └──────────────────────────────┘  │
           │                                                      │
           │     ┌──────────────────────────────┐                │
           │     │          access              │                │
           │     ├──────────────────────────────┤                │
           └─────┤ id (PK)                      │                │
                 │ patient_id                   │                │
                 │ doctor_id ───────────────────┼────────────────┘
                 │ expires_at                   │
                 │ UNIQUE(patient_id, doctor_id)│
                 └──────────────────────────────┘
```

---

## 🔒 Security

### Authentication Flow

```
┌────────┐          ┌────────┐          ┌────────┐
│ Client │          │ Server │          │   DB   │
└───┬────┘          └───┬────┘          └───┬────┘
    │   POST /login     │                   │
    │──────────────────▶│                   │
    │                   │  Verify password  │
    │                   │──────────────────▶│
    │                   │◀──────────────────│
    │   JWT Token       │                   │
    │◀──────────────────│                   │
    │                   │                   │
    │ GET /records/me   │                   │
    │ + Bearer Token    │                   │
    │──────────────────▶│                   │
    │                   │  Validate JWT     │
    │                   │  Extract userId   │
    │                   │  Check role       │
    │                   │──────────────────▶│
    │   Patient Records │◀──────────────────│
    │◀──────────────────│                   │
    │                   │                   │
```

### Security Measures

| Layer | Protection |
|-------|------------|
| **Password** | BCrypt hashing (cost factor 10) |
| **Authentication** | JWT with HS384 algorithm |
| **Authorization** | Role-based + consent-based access |
| **Token Expiry** | 1 hour validity |
| **Access Grants** | 30-day expiration |
| **Session** | Stateless (no server-side sessions) |

### Access Control Matrix

| Action | Patient | Doctor | Admin |
|--------|:-------:|:------:|:-----:|
| View own records | ✅ | ❌ | ❌ |
| Grant access | ✅ | ❌ | ❌ |
| View patient records | ❌ | ✅* | ❌ |
| Create records | ❌ | ✅* | ❌ |

*\*Requires active access grant from patient*

---

## 📁 Project Structure

```
DigiArogyaV2/
├── 📂 backend/
│   ├── 📂 src/main/java/com/digiarogya/backend/
│   │   ├── 📂 config/
│   │   │   └── SecurityConfig.java       # Spring Security configuration
│   │   ├── 📂 controller/
│   │   │   ├── UserController.java       # Auth endpoints
│   │   │   └── RecordController.java     # Records endpoints
│   │   ├── 📂 dto/
│   │   │   ├── CreateUserRequest.java
│   │   │   ├── CreateRecordRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── GrantAccessRequest.java
│   │   │   ├── UserResponse.java
│   │   │   ├── PatientRecordResponse.java
│   │   │   └── PaginatedRecordResponse.java
│   │   ├── 📂 entity/
│   │   │   ├── User.java
│   │   │   ├── PatientRecord.java
│   │   │   ├── Access.java
│   │   │   ├── Role.java
│   │   │   └── RecordType.java
│   │   ├── 📂 exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── AccessDeniedException.java
│   │   │   ├── AccessRequiredException.java
│   │   │   └── ...
│   │   ├── 📂 repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── PatientRecordRepository.java
│   │   │   └── AccessRepository.java
│   │   ├── 📂 security/
│   │   │   ├── JwtFilter.java
│   │   │   └── JwtUtil.java
│   │   ├── 📂 service/
│   │   │   ├── UserService.java
│   │   │   └── RecordService.java
│   │   └── DigiarogyaBackendApplication.java
│   ├── 📂 src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── 📂 assets/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🗺️ Roadmap

### ✅ Completed
- [x] User registration with role validation
- [x] JWT authentication
- [x] Patient record viewing with pagination
- [x] Doctor access control system
- [x] Record creation by doctors
- [x] Time-limited access grants
- [x] Structured error handling

### 🔜 In Progress
- [ ] Frontend implementation (React)
- [ ] Revoke access functionality
- [ ] Access expiration notifications

### 📋 Planned
- [ ] Audit logging
- [ ] Record filtering and search
- [ ] File/document uploads
- [ ] Email notifications
- [ ] Multi-factor authentication
- [ ] Admin dashboard
- [ ] Docker deployment
- [ ] API rate limiting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Anmol**

- GitHub: [@anmol](https://github.com/anmol)

---

<p align="center">
  <sub>Built with ❤️ for better healthcare data management</sub>
</p>
