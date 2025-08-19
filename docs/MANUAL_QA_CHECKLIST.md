# Manual QA Checklist for AI Permit Inspection Navigator

## 🚀 **Pre-Deployment Checklist**

### Environment Variables
- [ ] `DATABASE_URL` is set to production PostgreSQL
- [ ] `NEXTAUTH_SECRET` is set to a strong, unique secret
- [ ] `NEXTAUTH_URL` is set to production domain
- [ ] All other required environment variables are configured

### Database Setup
- [ ] PostgreSQL database is running and accessible
- [ ] Prisma migrations have been run (`npx prisma migrate deploy`)
- [ ] Database seed has been run (`npm run db:seed`)
- [ ] Database connection is stable

---

## 🔐 **Authentication & Authorization Testing**

### Login Flow
- [ ] **Login Page Loads**: `/login` page renders correctly
- [ ] **Form Validation**: Empty form submission shows validation errors
- [ ] **Invalid Credentials**: Wrong email/password shows error message
- [ ] **Valid Login**: Correct credentials redirect to appropriate dashboard
- [ ] **Session Persistence**: Login persists across page refreshes

### Role-Based Access Control (RBAC)
- [ ] **Admin User** (`admin@example.com` / `password123`)
  - [ ] Can access `/admin` routes
  - [ ] Can access `/moderator` routes
  - [ ] Can access `/dashboard` routes
  - [ ] Sees admin-specific navigation items

- [ ] **Moderator User** (`moderator@example.com` / `password123`)
  - [ ] Cannot access `/admin` routes (redirects to unauthorized)
  - [ ] Can access `/moderator` routes
  - [ ] Can access `/dashboard` routes
  - [ ] Sees moderator-specific navigation items

- [ ] **Regular User** (`user@example.com` / `password123`)
  - [ ] Cannot access `/admin` routes (redirects to unauthorized)
  - [ ] Cannot access `/moderator` routes (redirects to unauthorized)
  - [ ] Can access `/dashboard` routes
  - [ ] Sees user-specific navigation items

### Logout & Session Management
- [ ] **Logout Button**: Logout button is visible in sidebar
- [ ] **Logout Functionality**: Clicking logout clears session
- [ ] **Post-Logout Redirect**: After logout, redirects to login page
- [ ] **Session Expiry**: Session expires after appropriate time

---

## 🏠 **Page Navigation & Layout Testing**

### Public Pages
- [ ] **Home Page** (`/`): Renders correctly with proper content
- [ ] **Login Page** (`/login`): Form and styling are correct
- [ ] **Unauthorized Page** (`/unauthorized`): Shows proper access denied message

### Protected Pages
- [ ] **Dashboard** (`/dashboard`): Main dashboard loads with real data
- [ ] **Projects** (`/dashboard/projects`): Projects list displays correctly
- [ ] **Reports** (`/dashboard/reports`): Reports list displays correctly
- [ ] **Analytics** (`/dashboard/analytics`): Analytics page loads with charts
- [ ] **Settings** (`/dashboard/settings`): Settings page is accessible

### Navigation & Sidebar
- [ ] **Sidebar Toggle**: Mobile sidebar opens/closes correctly
- [ ] **Active States**: Current page is highlighted in navigation
- [ ] **Role-Based Menu**: Menu items change based on user role
- [ ] **Responsive Design**: Layout works on mobile and desktop

---

## 📊 **Data Display & Functionality Testing**

### Dashboard Data
- [ ] **Statistics Cards**: Show real numbers from database
- [ ] **Recent Activity**: Displays actual reports and projects
- [ ] **Quick Actions**: Buttons link to correct pages
- [ ] **Loading States**: Skeleton loaders show while data loads

### Projects Management
- [ ] **Projects List**: Displays real project data from database
- [ ] **Project Details**: Clicking on project shows correct information
- [ ] **Search & Filter**: Search functionality works correctly
- [ ] **Empty States**: Shows appropriate message when no projects exist

### Reports Management
- [ ] **Reports List**: Displays real report data from database
- [ ] **Report Details**: Individual report pages show correct data
- [ ] **Status Updates**: Report statuses are displayed correctly
- [ ] **Filtering**: Status and category filters work

### Analytics & Charts
- [ ] **Chart Rendering**: Recharts components render without errors
- [ ] **Data Display**: Charts show real data from database
- [ ] **Responsive Charts**: Charts resize correctly on different screen sizes
- [ ] **Loading States**: Charts show loading skeletons while data loads

---

## 📤 **Export Functionality Testing**

### CSV Export
- [ ] **Export Button**: CSV export button is visible and clickable
- [ ] **File Download**: CSV file downloads with correct filename
- [ ] **Data Content**: CSV contains correct report data
- [ ] **File Format**: CSV is properly formatted and readable

### PDF Export
- [ ] **Export Button**: PDF export button is visible and clickable
- [ ] **File Download**: PDF file downloads with correct filename
- [ ] **PDF Content**: PDF contains correct report information
- [ ] **PDF Quality**: PDF is properly formatted and readable

---

## 🔧 **API Endpoint Testing**

### Health Check
- [ ] **Endpoint Access**: `/api/health` returns 200 status
- [ ] **Database Status**: Response shows `database.status: "connected"`
- [ ] **Response Time**: Response includes latency information
- [ ] **Error Handling**: Returns 503 when database is down

### Protected APIs
- [ ] **Authentication Required**: Protected endpoints require valid session
- [ ] **Role-Based Access**: Admin-only endpoints reject non-admin users
- [ ] **Error Responses**: Proper error messages for unauthorized access

---

## 📱 **Responsive Design Testing**

### Desktop (1200px+)
- [ ] **Layout**: Full sidebar and main content area
- [ ] **Navigation**: All menu items visible
- [ ] **Charts**: Charts render at full size
- [ ] **Tables**: Data tables display all columns

### Tablet (768px - 1199px)
- [ ] **Sidebar**: Collapsible sidebar works correctly
- [ ] **Content**: Main content adjusts to available space
- [ ] **Charts**: Charts resize appropriately
- [ ] **Navigation**: Mobile menu toggle is functional

### Mobile (320px - 767px)
- [ ] **Mobile Menu**: Sidebar slides in from left
- [ ] **Touch Targets**: Buttons are appropriately sized
- [ ] **Content**: Text and images are readable
- [ ] **Charts**: Charts are mobile-friendly

---

## 🚨 **Error Handling Testing**

### Network Errors
- [ ] **Offline State**: Application handles network disconnection gracefully
- [ ] **API Failures**: Failed API calls show appropriate error messages
- [ ] **Retry Logic**: Failed requests can be retried

### User Errors
- [ ] **Invalid Input**: Form validation prevents invalid submissions
- [ ] **Error Messages**: Clear error messages guide users
- [ ] **Recovery**: Users can recover from errors easily

---

## 🔍 **Performance Testing**

### Loading Performance
- [ ] **Initial Load**: Home page loads in under 3 seconds
- [ ] **Dashboard Load**: Dashboard loads in under 2 seconds
- [ ] **Chart Rendering**: Charts render in under 1 second
- [ ] **Image Loading**: Images load progressively

### User Experience
- [ ] **Smooth Navigation**: Page transitions are smooth
- [ ] **Responsive UI**: Interface responds quickly to user input
- [ ] **Loading States**: Appropriate loading indicators are shown

---

## 🧪 **Integration Testing**

### End-to-End Workflows
- [ ] **User Registration**: Complete user onboarding flow
- [ ] **Project Creation**: Create, edit, and delete projects
- [ ] **Report Submission**: Submit and review reports
- [ ] **Export Workflow**: Generate and download exports

### Cross-Browser Testing
- [ ] **Chrome**: All functionality works correctly
- [ ] **Firefox**: All functionality works correctly
- [ ] **Safari**: All functionality works correctly
- [ ] **Edge**: All functionality works correctly

---

## 📋 **Post-Testing Actions**

### Documentation
- [ ] **Issues Logged**: All found issues are documented
- [ ] **Priority Assigned**: Issues are prioritized by severity
- [ ] **Reproduction Steps**: Clear steps to reproduce issues

### Deployment Approval
- [ ] **Critical Issues**: No critical issues remain open
- [ ] **Performance**: Performance meets requirements
- [ ] **Security**: Security review completed
- [ ] **Stakeholder Sign-off**: All stakeholders approve deployment

---

## 🎯 **Success Criteria**

**Application is ready for production when:**
- ✅ All critical functionality tests pass
- ✅ No high-priority bugs remain open
- ✅ Performance meets or exceeds requirements
- ✅ Security review is complete
- ✅ Stakeholder approval is obtained

**Test Results Summary:**
- Total Tests: ___
- Passed: ___
- Failed: ___
- Success Rate: ___%

**Tester:** _________________
**Date:** _________________
**Approval:** _________________