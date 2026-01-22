# DigiArogya V2

A comprehensive electronic health records (EHR) management system designed for real-world use by patients and healthcare providers. It features a consent-driven model where patient data is private by default and shared only when explicitly approved.

## Features

### Patient Features
- Secure login and registration
- Complete control over medical records ("Privacy by Default")
- Grant time-limited access to doctors (e.g., 30 days)
- View access history and audit logs
- Revoke access at any time

### Doctor Features
- Secure login
- Request access to patient records
- View granted patient records
- Add and update medical records (with permission)

### Admin Features
- User management (Doctors, Patients)
- System-wide security audit logs
- Dashboard for system monitoring

## Tech Stack

- **Framework**: Spring Boot 3.4 (Backend), React 19 (Frontend)
- **Language**: Java 21, JavaScript/JSX
- **Build Tool**: Maven, Vite
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 16
- **Authentication**: JWT-based security (Spring Security)

## Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL database

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/DigiArogyaV2.git
    cd DigiArogyaV2
    ```

2.  **Backend Setup**:
    Update database configuration in `backend/src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/digiarogya
    spring.datasource.username=postgres
    spring.datasource.password=your_password
    ```
    
    Run the backend:
    ```bash
    cd backend
    # Windows
    .\mvnw spring-boot:run
    # Linux/Mac
    ./mvnw spring-boot:run
    ```

3.  **Frontend Setup**:
    Install dependencies and run the development server:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**:
    Open http://localhost:5173 in your browser.

## Project Structure

```
DigiArogyaV2/
├── backend/
│   ├── src/main/java/com/digiarogya/backend/
│   │   ├── config/         # Security & App Config (Cors, Security)
│   │   ├── controller/     # REST API Controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entities (Database Models)
│   │   ├── repository/     # Data Access Layer
│   │   └── service/        # Business Logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # React Context (Auth, etc.)
│   │   ├── pages/          # Application Pages
│   │   │   ├── dashboard/  # Admin, Doctor, Patient Dashboards
│   │   └── services/       # API integration files
│   └── vite.config.js
├── Dockerfile
└── render.yaml
```

## API Routes

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user

### Record Routes
- `GET /api/records` - Fetch usage/medical records
- `POST /api/records` - Create a new record
- `PUT /api/records/{id}` - Update a record

### Access & Logs
- `POST /api/access/grant` - Grant access to a doctor
- `GET /api/audit-logs` - Get security audit trail

## Deployment

The application is containerized and ready for cloud deployment.

- **Frontend**: Configured for Vercel
- **Backend**: Configured for Render (see `render.yaml`)

## Default Credentials (Demo)

Use these accounts to test the application locally:

**Patient:**
- Email: `patient@test.com`
- Password: `test123`

**Doctor:**
- Email: `doctor@test.com`
- Password: `test123`

## License

MIT
