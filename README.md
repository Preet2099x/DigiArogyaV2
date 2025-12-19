# DigiArogya V2 — Backend Control Flow & Architecture

This document describes how data flows through the DigiArogya V2 backend system,
what each layer is responsible for, and how roles and medical data are handled.

The backend follows a strict layered architecture:

Controller → Service → Repository → Database

---

## 1. Core Layers and Responsibilities

### Controller
- Handles HTTP requests and responses
- Accepts request DTOs
- Returns response DTOs
- Does NOT contain business logic
- Does NOT access the database

### Service
- Contains all business logic
- Enforces rules and permissions
- Coordinates between controllers and repositories
- Never knows about HTTP or JSON

### Repository
- Only layer that talks to the database
- Uses Spring Data JPA
- No business rules

### Entity
- Represents database tables
- Used internally only
- Never exposed directly via APIs

### DTO (Data Transfer Object)
- Defines API input/output structure
- Used only at controller boundary
- Jackson converts JSON ↔ DTO

---

## 2. Account Creation Flow (Implemented)

### Endpoint
POST /api/users

### Flow
Client  
→ HTTP request (JSON)  
→ Jackson  
→ CreateUserRequest DTO  
→ UserController  
→ UserService  
→ UserRepository  
→ PostgreSQL  

### Details
- Role is sent as a string in JSON
- Jackson converts role to Role enum (case-insensitive)
- Invalid roles fail before controller execution (400)
- Service hashes password using BCrypt
- User is persisted with role stored as STRING

### Key Principle
Closed domain concepts (roles) are validated at the API boundary.

---

## 3. Login Flow (Implemented, No JWT)

### Endpoint
POST /api/users/login

### Flow
Client  
→ LoginRequest DTO  
→ UserController  
→ UserService  
→ UserRepository  
→ BCrypt password verification  

### Details
- User is fetched by email
- Password is verified using passwordEncoder.matches
- Same error for invalid email or password
- No JWT, sessions, or security context yet

### Purpose
Identity verification only.

---

## 4. Role Handling (Completed)

### Role Enum
- Central definition of all allowed roles
- Case-insensitive JSON deserialization
- Consistent serialization in responses

### Invalid Role Handling
- Invalid roles fail during JSON → DTO conversion
- Global exception handler returns structured 400 response
- Controller and service are never reached

### Principle
Validate early, fail fast, fail clearly.

---

## 5. Medical Records — Conceptual Design

### Core Entities (Conceptual)

User  
- id  
- role (PATIENT, DOCTOR, etc.)

PatientRecord  
- id  
- patientId (User with PATIENT role)  
- createdBy (Doctor / Hospital / Lab)  
- medicalData  
- reports  
- timestamps  

---

## 6. Creating a Medical Record (Future)

### Who Can Create
- DOCTOR
- HOSPITAL
- LAB (restricted)

### Flow
Authenticated provider  
→ POST /api/records  
→ Controller  
→ Service  
→ Authorization checks  
→ Repository  
→ Database  

### Service-Level Checks
- Patient exists
- Target user has PATIENT role
- Requester role is allowed
- Requester is authorized

All authorization logic lives in the service layer.

---

## 7. Patient Viewing Their Own Records (Future)

### Flow
Patient  
→ GET /api/records/me  
→ Controller  
→ Service  
→ Repository  

### Rule
Patient never supplies patientId.
Backend derives identity from authentication context (later).

---

## 8. Doctor Viewing Patient Records (Future)

### Flow
Doctor  
→ GET /api/records/{patientId}  
→ Controller  
→ Service  
→ Authorization checks  
→ Repository  

### Rules
- Doctor role required
- Access must be explicit and auditable
- No unrestricted access

---

## 9. Role Usage Summary

Role is used only in the following places:

- Enum: defines allowed roles
- Service: authorization decisions
- Security layer: request filtering (future)

Role is never trusted from client input after login.

---

## 10. High-Level Mental Model

HTTP  
→ DTO  
→ Service (rules & authorization)  
→ Repository  
→ Database  

### Guiding Principle
Validate at the edge. Enforce in the service. Persist cleanly.

---

## 11. One-Line Summary

DigiArogya V2 is a role-driven healthcare backend where identity is verified via login, and all access to medical data is enforced at the service layer based on role and ownership.
