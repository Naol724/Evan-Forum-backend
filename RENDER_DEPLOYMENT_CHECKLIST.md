# Render Deployment Checklist ✅

## Pre-Deployment Verification

### ✅ Database Configuration
- [x] Database configured for PostgreSQL
- [x] Connection uses `DATABASE_URL` environment variable
- [x] SSL configuration set for production
- [x] Query wrapper created to handle MySQL-style queries (`?` placeholders)
- [x] Tables auto-initialize on server start
- [x] Foreign key constraints properly set with CASCADE

### ✅ Backend Configuration
- [x] CORS configured to accept frontend URL from environment variable
- [x] Port configured from `process.env.PORT` (Render requirement)
- [x] Static file serving for uploads configured
- [x] All routes properly protected with auth middleware
- [x] Error handling in place

### ✅ Frontend Configuration
- [x] API URL configured via environment variable (`VITE_API_URL`)
- [x] Build command set to `npm install && npm run build`
- [x] Output directory is `dist`

### ✅ Environment Files
- [x] `.env.example` files created for both client and server
- [x] `.env` files in `.gitignore`
- [x] Sensitive data not committed to repository

---

## Deployment Steps

### Step 1: Create PostgreSQL Database on Render

1. **Login to Render**: https://dashboard.render.com
2. **Create Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `evangadi-forum-db`
   - Database: `evan_forum`
   - Region: Choose closest to your users (e.g., Oregon)
   - Plan: Free (or paid for production)
3. **Save Connection Details**:
   - Copy "Internal Database URL" (starts with `postgresql://`)
   - Format: `postgresql://user:password@host:port/database`

**Status**: ⬜ Not Started | ✅ Completed

---

### Step 2: Deploy Backend Server

1. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the repository

2. **Configure Service**:
   ```
   Name: evangadi-forum-backend
   Region: Same as database (e.g., Oregon)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (or paid)
   ```

3. **Environment Variables** (Critical!):
   ```
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   JWT_SECRET=13na03bn3ei13n03r18109c4d6a7e1f0g3h5j6k7l8m9n0o1p
   OPENAI_API_KEY=your_groq_api_key_here
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```
   
   **Note**: Update `CLIENT_URL` after deploying frontend (Step 3)

4. **Health Check**:
   - Path: `/test`
   - This ensures Render knows your service is running

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Check logs for "✅ Database connected successfully"

6. **Save Backend URL**:
   - Copy URL: `https://evangadi-forum-backend.onrender.com`

**Status**: ⬜ Not Started | ✅ Completed

---

### Step 3: Deploy Frontend

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Connect your repository
   - Select the repository

2. **Configure Site**:
   ```
   Name: evangadi-forum-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables**:
   ```
   VITE_API_URL=https://evangadi-forum-backend.onrender.com/api
   ```
   
   Replace with your actual backend URL from Step 2

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for build (3-5 minutes)

5. **Save Frontend URL**:
   - Copy URL: `https://evangadi-forum-frontend.onrender.com`

**Status**: ⬜ Not Started | ✅ Completed

---

### Step 4: Update Backend CORS

1. **Go to Backend Service** on Render Dashboard
2. **Update Environment Variables**:
   - Find `CLIENT_URL` variable
   - Update value: `https://evangadi-forum-frontend.onrender.com`
   - Save changes
3. **Wait for Redeploy** (automatic, ~2 minutes)

**Status**: ⬜ Not Started | ✅ Completed

---

### Step 5: Test Deployment

Test each feature to ensure everything works:

#### Authentication Tests
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Check protected routes redirect to login

#### Question Tests
- [ ] View questions list
- [ ] Create new question
- [ ] Edit own question
- [ ] Delete own question
- [ ] View question details

#### Answer Tests
- [ ] Post answer to question
- [ ] Edit own answer
- [ ] Delete own answer
- [ ] View all answers

#### Profile Tests
- [ ] View profile
- [ ] Upload profile picture
- [ ] Remove profile picture

#### Chatbot Tests
- [ ] Open chatbot widget
- [ ] Send message
- [ ] Receive AI response
- [ ] View chat history

#### Password Reset Tests
- [ ] Request password reset
- [ ] Check email received (if configured)
- [ ] Reset password with token

**Status**: ⬜ Not Started | ✅ Completed

---

## Post-Deployment Configuration

### Email Configuration (Optional)

If you want password reset emails to work:

1. **Get SMTP Credentials**:
   - Gmail: Use App Password (not regular password)
   - Other: Get SMTP details from your email provider

2. **Add to Backend Environment Variables**:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Update Reset Link** in `server/controller/userController.js`:
   ```javascript
   const resetLink = `https://your-frontend-url.onrender.com/reset-password/${resetToken}`;
   ```

**Status**: ⬜ Not Started | ✅ Completed

---

## Troubleshooting Guide

### Backend Issues

#### "Database connection failed"
- ✅ Check `DATABASE_URL` is set correctly
- ✅ Verify database is running (check Render dashboard)
- ✅ Ensure database and backend are in same region
- ✅ Check logs for specific error message

#### "502 Bad Gateway"
- ✅ Wait 30 seconds (free tier spin-up time)
- ✅ Check backend logs for startup errors
- ✅ Verify `PORT` environment variable is set
- ✅ Check health check endpoint `/test` works

#### "CORS Error"
- ✅ Verify `CLIENT_URL` includes your frontend URL
- ✅ Check no trailing slash in URLs
- ✅ Ensure backend redeployed after updating `CLIENT_URL`

### Frontend Issues

#### "Network Error" or "Failed to fetch"
- ✅ Check `VITE_API_URL` is correct
- ✅ Verify backend is running
- ✅ Check browser console for specific error
- ✅ Test backend directly: `https://your-backend.onrender.com/test`

#### "Build Failed"
- ✅ Check build logs in Render dashboard
- ✅ Verify `package.json` has all dependencies
- ✅ Ensure Node version compatibility
- ✅ Check for TypeScript or ESLint errors

#### "Blank Page"
- ✅ Check browser console for errors
- ✅ Verify `dist` folder is being published
- ✅ Check routing configuration
- ✅ Ensure environment variables are set

### Database Issues

#### "Tables not created"
- ✅ Check backend logs during startup
- ✅ Verify `initializeTables()` runs successfully
- ✅ Check database permissions
- ✅ Manually connect to database and verify

#### "Foreign key constraint error"
- ✅ Ensure tables created in correct order
- ✅ Check CASCADE options are set
- ✅ Verify referenced records exist

---

## Performance Optimization

### Free Tier Considerations

1. **Backend Spin-Down**:
   - Free tier spins down after 15 minutes
   - First request takes ~30 seconds
   - Consider upgrading for production

2. **Database Limits**:
   - Free tier: 1GB storage, 90-day expiration
   - Monitor usage in Render dashboard
   - Upgrade before hitting limits

3. **File Uploads**:
   - Uploads stored on ephemeral disk
   - Files lost on redeploy
   - Use cloud storage (S3, Cloudinary) for production

### Recommended Upgrades

- **Backend**: $7/month (no spin-down, better performance)
- **Database**: $7/month (no expiration, 10GB storage)
- **Total**: $14/month for production-ready setup

---

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Render)
- [ ] Configure CORS to only allow your frontend
- [ ] Validate all user inputs
- [ ] Use parameterized queries (already implemented)
- [ ] Hash passwords with bcrypt (already implemented)
- [ ] Implement rate limiting (consider adding)
- [ ] Set up monitoring and alerts

---

## Monitoring & Maintenance

### Regular Checks

- [ ] Monitor database storage usage
- [ ] Check error logs weekly
- [ ] Test critical features monthly
- [ ] Update dependencies quarterly
- [ ] Backup database regularly (paid tier)

### Render Dashboard

- View logs: Service → Logs tab
- Check metrics: Service → Metrics tab
- Monitor events: Service → Events tab
- Database usage: Database → Metrics tab

---

## Custom Domain Setup (Optional)

### Frontend Domain

1. Go to Static Site → Settings → Custom Domain
2. Add your domain (e.g., `forum.yourdomain.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Backend Domain

1. Go to Web Service → Settings → Custom Domain
2. Add API subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records
4. Update frontend `VITE_API_URL` to new domain
5. Update backend `CLIENT_URL` if needed

---

## Rollback Plan

If deployment fails:

1. **Revert Git Changes**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Manual Rollback on Render**:
   - Go to Service → Events
   - Find last successful deploy
   - Click "Redeploy"

3. **Database Rollback**:
   - Restore from backup (paid tier only)
   - Or manually fix data issues

---

## Success Criteria

Your deployment is successful when:

- ✅ Backend health check returns "API is running"
- ✅ Frontend loads without errors
- ✅ User can register and login
- ✅ Questions and answers can be created
- ✅ Chatbot responds to messages
- ✅ No CORS errors in browser console
- ✅ Database tables created automatically
- ✅ All environment variables set correctly

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Node.js Docs**: https://nodejs.org/docs/

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Backend URL**: _____________

**Frontend URL**: _____________

**Database Name**: _____________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
