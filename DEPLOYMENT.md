# DigiArogya Backend - Render Deployment Guide

## Prerequisites
- A GitHub account
- A Render account (sign up at https://render.com)
- Your repository pushed to GitHub

## Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a Render Account
- Go to https://render.com
- Sign up using your GitHub account

### 3. Deploy Using Blueprint (Recommended)
This method will automatically create both the web service and PostgreSQL database.

1. Go to your Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Review the services to be created:
   - PostgreSQL database (digiarogya-db)
   - Web service (digiarogya-backend)
6. Click "Apply" to start deployment

### 4. Configure Environment Variables (Alternative Manual Setup)
If you prefer manual setup instead of using the blueprint:

#### Create PostgreSQL Database:
1. Click "New" → "PostgreSQL"
2. Name: `digiarogya-db`
3. Database: `digiarogya`
4. Choose Free plan
5. Click "Create Database"

#### Create Web Service:
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: digiarogya-backend
   - **Runtime**: Java
   - **Build Command**: `cd backend && ./mvnw clean install -DskipTests`
   - **Start Command**: `java -jar backend/target/backend-1.0.0.jar`
   - **Plan**: Free

4. Add Environment Variables:
   - `SPRING_PROFILES_ACTIVE` = `production`
   - `DATABASE_URL` = (copy from your PostgreSQL database's "Internal Database URL")
   - `JWT_SECRET` = (generate a random secure string, e.g., 64 characters)
   - `JWT_EXPIRATION` = `86400000`
   - `FRONTEND_URL` = (your frontend URL, e.g., `https://your-frontend.onrender.com`)

5. Click "Create Web Service"

### 5. Wait for Deployment
- Render will build and deploy your application
- First deployment may take 5-10 minutes
- Watch the build logs for any errors

### 6. Get Your Backend URL
- Once deployed, you'll get a URL like: `https://digiarogya-backend.onrender.com`
- Save this URL to configure your frontend

## Important Notes

### Free Tier Limitations
- Your service will spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Database has 90-day expiration on free tier

### Database Connection
- Render automatically injects the `DATABASE_URL` environment variable
- The application-production.properties file is configured to use this

### CORS Configuration
- Update the `FRONTEND_URL` environment variable with your actual frontend URL
- You can add multiple origins separated by commas: `https://app1.com,https://app2.com`

### Security
- **IMPORTANT**: Generate a strong, random JWT_SECRET
- Never commit secrets to your repository
- Use Render's environment variables for all sensitive data

### Monitoring
- Check logs: Dashboard → Your Service → Logs
- View metrics: Dashboard → Your Service → Metrics

## Testing Your Deployment

Test your API endpoints:
```bash
# Health check (if you have one)
curl https://digiarogya-backend.onrender.com/actuator/health

# Test an endpoint
curl https://digiarogya-backend.onrender.com/api/users/test
```

## Troubleshooting

### Build Fails
- Check that Java 21 is specified in pom.xml
- Ensure mvnw has execute permissions
- Review build logs in Render dashboard

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check database is running and not expired
- Review application logs for connection errors

### Application Won't Start
- Check start command is correct
- Verify PORT environment variable (Render sets this automatically)
- Review application startup logs

### CORS Errors
- Ensure FRONTEND_URL is set correctly
- Check CorsConfig is properly configured
- Verify frontend is making requests to correct backend URL

## Updating Your Deployment

Render automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Or manually redeploy from Render Dashboard:
1. Go to your service
2. Click "Manual Deploy" → "Deploy latest commit"

## Next Steps

1. Update your frontend to use the Render backend URL
2. Set up custom domain (optional, requires paid plan)
3. Configure health checks
4. Set up monitoring and alerts
5. Consider upgrading to paid tier for production use
