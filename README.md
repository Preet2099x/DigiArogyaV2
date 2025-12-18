# DigiArogya v2

DigiArogya v2 is a full-stack healthcare platform designed to model a real-world digital healthcare ecosystem, enabling secure user onboarding, role-based access, and scalable backend architecture using modern enterprise practices.

---

## Overview

DigiArogya v2 aims to simulate how healthcare systems operate digitally by separating responsibilities across clearly defined layers. The project focuses on backend correctness, security, and extensibility while being paired with a modern React frontend.

This is **not** a CRUD demo. It is a production-style system built to reflect how backend-heavy applications are structured in real companies.

---

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA (Hibernate)
- Spring Security (BCrypt password hashing)
- PostgreSQL
- Maven

### Frontend
- React
- Tailwind CSS
- REST API integration

---

## Current Features

### User Account System
- User account creation via REST API
- Secure password hashing using BCrypt
- Email uniqueness enforced at database level
- Role assignment at account creation

### Role Management
- Roles are implemented as a **strict enum**
- Supported roles include:
  - PATIENT
  - DOCTOR
  - (extendable to HOSPITAL, LAB, PHARMACY, INSURANCE, ADMIN)
- Roles are persisted as readable strings in the database

### Architecture
- Layered architecture:
  - Controller (HTTP boundary)
  - Service (business logic)
  - Repository (database access)
  - Entity (database schema)
  - DTOs (request/response contracts)
- DTOs isolate external API contracts from internal database models
- Entities are never exposed directly to clients

---

## Data Flow (High Level)

1. Client sends JSON request to backend
2. Spring converts JSON into request DTO
3. Controller validates and forwards data to service layer
4. Service applies business logic and security rules
5. Repository persists entity to PostgreSQL
6. Controller returns a response DTO
7. Spring serializes response DTO into JSON

---

## Security Considerations

- Passwords are never stored or returned in plain text
- BCrypt hashing is enforced at service layer
- Entities are not exposed directly via API
- Security configuration is modular and extensible for future authentication (JWT, OAuth, etc.)

---

## Frontend (Planned & In Progress)

- React-based UI for account creation and authentication
- Role-aware UI rendering
- API-driven data flow
- Separation of UI concerns from backend logic

---

## Status

Active development  
Backend core completed  
Frontend integration in progress  

---

## Future Roadmap

- Authentication & login flow
- JWT-based authorization
- Role-based access control
- Domain expansion (Patient records, Doctors, Hospitals)
- Audit logging
- Deployment & containerization

---

