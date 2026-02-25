# Quick Start - Deploy to Render in 10 Minutes

## Prerequisites
- Git repository pushed to GitHub/GitLab/Bitbucket
- Render account (free): https://render.com

---

## Step 1: Create PostgreSQL Database (2 min)

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - Name: `evangadi-forum-db`
   - Database: `evan_forum`
   - Region: `Oregon` (or closest to you)
4. Click **Create Database**
5. **Copy "Internal Database URL"** (you'll need this next)

---

## Step 2: Deploy Backend (4 min)

1. Click **New +** → **Web Service**
2. Connect your repository
3. Configure:
   - Name: `evangadi-forum-backend`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**:
   ```
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   JWT_SECRET = 13na03bn3ei13n03r18109c4d6a7e1f0g3h5j6k7l8m9n0o1p
   OPENAI_API_KEY = your_groq_api_key_here
   PORT = 5000
   NODE_ENV = production
   CLIENT_URL = https://your-frontend.onrender.com
   ```
   (You'll update CLIENT_URL in step 4)

5. Click **Create Web Service**
6. **Copy your backend URL** (e.g., `https://evangadi-forum-backend.onrender.com`)

---

## Step 3: Deploy Frontend (3 min)

1. Click **New +** → **Static Site**
2. Connect your repository
3. Configure:
   - Name: `evangadi-forum-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. **Add Environment Variable**:
   ```
   VITE_API_URL = https://evangadi-forum-backend.onrender.com/api
   ```
   (Use your actual backend URL from step 2)

5. Click **Create Static Site**
6. **Copy your frontend URL** (e.g., `https://evangadi-forum-frontend.onrender.com`)

---

## Step 4: Update Backend CORS (1 min)

1. Go back to your **backend service**
2. Click **Environment**
3. Update `CLIENT_URL` to your frontend URL from step 3
4. Click **Save Changes** (auto-redeploys)

---

## ✅ Done! Test Your App

Visit your frontend URL and test:
- Register a new account
- Login
- Create a question
- Post an answer
- Try the chatbot

---

## 🐛 Troubleshooting

**Backend shows "Database connection failed"**
- Check DATABASE_URL is correct
- Verify database is running

**Frontend shows CORS error**
- Verify CLIENT_URL matches your frontend URL exactly
- Wait for backend to finish redeploying

**502 Bad Gateway**
- Wait 30 seconds (free tier spin-up)
- Check backend logs for errors

---

## 📚 Need More Help?

- Full Guide: See `DEPLOYMENT.md`
- Checklist: See `RENDER_DEPLOYMENT_CHECKLIST.md`
- Architecture: See `DEPLOYMENT_SUMMARY.md`

---

**That's it! Your app is live! 🎉**
