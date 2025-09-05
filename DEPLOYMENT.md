# AI Permit Inspection Navigator - Deployment Guide

## 🚀 **Production Deployment Checklist**

### **Pre-Deployment Requirements**

- [ ] PostgreSQL database set up and accessible
- [ ] Environment variables configured
- [ ] Domain/URL configured for production
- [ ] SSL certificates ready (if self-hosting)

### **Environment Variables Setup**

Copy `.env.example` to `.env.local` and configure:

```bash
# Required
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="generate-a-strong-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Optional
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### **Database Setup**

1. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ai_permit_inspector;
   ```

2. **Run Migrations**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations (PRODUCTION - do NOT use migrate dev)
   npx prisma migrate deploy
   ```

3. **Seed Database**
   ```bash
   # Seed with initial data
   npm run db:seed
   ```

### **Vercel Deployment**

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository in Vercel dashboard

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Ensure `DATABASE_URL` points to production database

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Monitor build logs for any errors

### **Post-Deployment Verification**

1. **Health Check**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Database Connectivity**
   - Verify `/api/health` returns `"database": {"status": "connected"}`
   - Check database logs for connection issues

3. **Authentication Test**
   - Test login with seed users
   - Verify role-based access control

4. **API Endpoints Test**
   - Test protected routes require authentication
   - Verify admin/moderator permissions work

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Check import paths and exports

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check database is accessible from deployment environment
   - Ensure Prisma client is generated

3. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches deployment URL
   - Ensure database is seeded with users

### **Performance Optimization**

1. **Database Indexes**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_reports_user_id ON reports(user_id);
   CREATE INDEX idx_projects_user_id ON projects(user_id);
   CREATE INDEX idx_appeals_status ON appeals(status);
   ```

2. **Caching**
   - Implement Redis for session storage (optional)
   - Add response caching for static data

## 📊 **Monitoring & Maintenance**

### **Health Checks**

- Monitor `/api/health` endpoint
- Set up uptime monitoring
- Configure error alerting

### **Database Maintenance**

- Regular backups
- Monitor query performance
- Clean up old audit logs

### **Security Updates**

- Keep dependencies updated
- Monitor security advisories
- Regular security audits

## 🎯 **Success Metrics**

- [ ] Application builds successfully
- [ ] All API endpoints respond correctly
- [ ] Authentication and RBAC work properly
- [ ] Database operations complete successfully
- [ ] Health check reports healthy status
- [ ] No critical errors in logs