#!/bin/bash
# Render build script for DigiArogya Backend

echo "Building DigiArogya Backend..."

# Navigate to backend directory
cd backend

# Make mvnw executable
chmod +x mvnw

# Clean and build the project
./mvnw clean install -DskipTests

echo "Build completed successfully!"
