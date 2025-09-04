# Vercel Deployment Guide - AI Permit Inspection Navigator

## 🚀 **Quick Deployment Steps**

### **1. Repository Setup**
```bash
# Ensure all changes are committed and pushed
git add .
git commit -m "feat: complete platform overhaul with NextAuth and comprehensive schema"
git push origin main
```

### **2. Vercel Project Setup**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### **3. Environment Variables**
Add these environment variables in Vercel dashboard:

```bash
# Required - Database
DATABASE_URL=postgresql://username:password@host:port/database

# Required - Authentication
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars
NEXTAUTH_URL=https://your-vercel-app.vercel.app

# Optional - External Services
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **4. Database Setup**

#### **Option A: Vercel Postgres (Recommended)**
```bash
# In Vercel dashboard, go to Storage tab
# Create new Postgres database
# Copy connection string to DATABASE_URL
```

#### **Option B: External PostgreSQL**
```bash
# Create database
CREATE DATABASE ai_permit_inspector;

# Run migrations
npx prisma migrate deploy

# Seed database (run locally, not on Vercel)
npm run db:seed
```

### **5. Deploy**
1. Click "Deploy" in Vercel
2. Monitor build logs
3. Verify deployment success

---

## 🔧 **Troubleshooting Common Issues**

### **Build Failures**

#### **Missing Dependencies**
If you see "Module not found" errors:
```bash
# Ensure package.json includes all dependencies
npm install
npm run build
```

#### **Prisma Client Issues**
If you see Prisma client errors:
```bash
# Regenerate Prisma client
npx prisma generate
npm run build
```

#### **TypeScript Errors**
If you see TypeScript compilation errors:
```bash
# Check type definitions
npm run lint
npx tsc --noEmit
```

### **Runtime Errors**

#### **Database Connection**
If `/api/health` shows database disconnected:
1. Verify `DATABASE_URL` is correct
2. Check database is accessible from Vercel
3. Verify migrations are applied

#### **Authentication Issues**
If login doesn't work:
1. Verify `NEXTAUTH_SECRET` is set (min 32 characters)
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure database is seeded with users

---

## 🎯 **Post-Deployment Verification**

### **1. Health Check**
```bash
curl https://your-app.vercel.app/api/health
```
Should return:
```json
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "latency": "50ms"
  }
}
```

### **2. Authentication Test**
1. Visit `/login`
2. Test with seed users:
   - `admin@example.com` / `password123`
   - `moderator@example.com` / `password123`
   - `user@example.com` / `password123`

### **3. Protected Routes Test**
- `/dashboard` - Should require login
- `/admin` - Should require admin role
- `/moderator` - Should require moderator+ role

### **4. API Endpoints Test**
```bash
# Test protected API (should return 401 without auth)
curl https://your-app.vercel.app/api/reports

# Test exports
curl https://your-app.vercel.app/api/exports/csv
```

### **5. Run Automated Tests**
```bash
# Run smoke tests
node scripts/smoke-test.js https://your-app.vercel.app
```

---

## 📋 **Success Criteria**

**Deployment is successful when:**
- ✅ Build completes without errors
- ✅ Health check returns "healthy" status
- ✅ Database connectivity confirmed
- ✅ Authentication flow works
- ✅ Role-based access control functions
- ✅ All API endpoints respond correctly
- ✅ No critical errors in function logs

---

## 🚨 **Emergency Rollback**

If deployment fails:
1. **Immediate Rollback**: Use Vercel dashboard to rollback to previous deployment
2. **Debug Locally**: Fix issues in local environment
3. **Test Thoroughly**: Ensure local build passes
4. **Redeploy**: Push fixes and redeploy

---

## 📞 **Support Checklist**

Before asking for help:
- [ ] Check Vercel build logs for specific errors
- [ ] Verify all environment variables are set
- [ ] Confirm database is accessible
- [ ] Test local build passes
- [ ] Review this deployment guide

**The platform is ready for production! 🎉**