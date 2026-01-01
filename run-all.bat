@echo off
REM Script to run both frontend and backend concurrently

REM Start backend (Spring Boot)
cd backend
start cmd /k mvnw spring-boot:run
cd ..

REM Start frontend (Vite)
cd frontend
start cmd /k npm run dev
cd ..

echo Both frontend and backend are starting in separate terminals.
pause
