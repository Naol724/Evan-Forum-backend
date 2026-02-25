# Render Deployment Guide

This guide will help you deploy the Evangadi Forum application on Render with separate services for the client, server, and database.

## Prerequisites

- A Render account (https://render.com)
- Git repository with your code pushed to GitHub/GitLab/Bitbucket

## Deployment Steps

### 1. Deploy PostgreSQL Database

1. Go to Render Dashboard → Click "New +" → Select "PostgreSQL"
2. Configure:
   - **Name**: `evangadi-forum-db` (or your preferred name)
   - **Database**: `evan_forum`
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (or latest)
   - **Plan**: Free or paid based on your needs
3. Click "Create Database"
4. **Important**: Copy the "Internal Database URL" - you'll need this for the backend

### 2. Deploy Backend (Server)

1. Go to Render Dashboard → Click "New +" → Select "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `evangadi-forum-backend`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or paid

4. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   JWT_SECRET=13na03bn3ei13n03r18109c4d6a7e1f0g3h5j6k7l8m9n0o1p
   OPENAI_API_KEY=your_groq_api_key_here
   PORT=5000
   CLIENT_URL=https://your-frontend-url.onrender.com
   NODE_ENV=production
   ```
   
   **Note**: You'll update `CLIENT_URL` after deploying the frontend in step 3.

5. Click "Create Web Service"
6. Wait for deployment to complete
7. **Copy your backend URL**: `https://evangadi-forum-backend.onrender.com`

### 3. Deploy Frontend (Client)

1. Go to Render Dashboard → Click "New +" → Select "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `evangadi-forum-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://evangadi-forum-backend.onrender.com/api
   ```
   
   Replace with your actual backend URL from step 2.

5. Click "Create Static Site"
6. Wait for deployment to complete
7. **Copy your frontend URL**: `https://evangadi-forum-frontend.onrender.com`

### 4. Update Backend CORS Configuration

1. Go back to your backend service on Render
2. Update the `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://evangadi-forum-frontend.onrender.com
   ```
3. Save changes - this will trigger a redeploy

### 5. Verify Deployment

1. Visit your frontend URL
2. Try to register a new account
3. Login and test creating questions/answers
4. Test the AI chatbot

## Important Notes

### Database Connection

- Render PostgreSQL provides an **Internal Database URL** (for services in the same region) and an **External Database URL**
- Always use the **Internal Database URL** for your backend service - it's faster and free
- The database URL format: `postgresql://user:password@host:port/database`

### Free Tier Limitations

- **Backend**: Spins down after 15 minutes of inactivity (first request after spin-down takes ~30 seconds)
- **Database**: 90-day expiration on free tier, 1GB storage limit
- **Frontend**: Always active, no spin-down

### Environment Variables Security

- Never commit `.env` files to Git
- Set all sensitive variables in Render Dashboard
- Use different secrets for production vs development

### CORS Configuration

- The backend is configured to accept requests from URLs in `CLIENT_URL`
- You can add multiple URLs separated by commas: `https://domain1.com,https://domain2.com`
- For development, add: `https://your-frontend.onrender.com,http://localhost:5173`

### File Uploads

- Profile pictures are stored in the `server/uploads` directory
- On Render's free tier, uploaded files are ephemeral (lost on redeploy)
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

## Troubleshooting

### Backend won't start
- Check logs in Render Dashboard
- Verify `DATABASE_URL` is set correctly
- Ensure all required environment variables are set

### Frontend can't connect to backend
- Verify `VITE_API_URL` in frontend environment variables
- Check backend CORS configuration includes frontend URL
- Check browser console for CORS errors

### Database connection fails
- Verify you're using the Internal Database URL
- Check database is in the same region as backend
- Ensure database is running (check Render dashboard)

### 502 Bad Gateway
- Backend is likely spinning up (wait 30 seconds on free tier)
- Check backend logs for errors

## Custom Domain (Optional)

### For Frontend:
1. Go to your static site settings
2. Click "Custom Domain"
3. Add your domain and follow DNS instructions

### For Backend:
1. Go to your web service settings
2. Click "Custom Domain"
3. Add your API subdomain (e.g., api.yourdomain.com)
4. Update frontend `VITE_API_URL` to use new domain

## Monitoring

- Check logs in Render Dashboard for each service
- Set up email notifications for deploy failures
- Monitor database usage to avoid hitting limits

## Updating Your Application

1. Push changes to your Git repository
2. Render will automatically detect changes and redeploy
3. You can also manually trigger deploys from the Render Dashboard

## Cost Optimization

- Use the same region for all services to minimize latency
- Consider upgrading database to paid tier for production (no expiration)
- Upgrade backend to paid tier to eliminate spin-down delays

---

**Need Help?**
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
