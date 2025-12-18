# Admin Panel Documentation

## 🎯 Admin Panel Endpoints

### **🔐 Authentication Endpoints**
```
POST /api/v1/auth/admin/login     - Admin login
POST /api/v1/auth/admin/logout    - Admin logout
GET  /api/v1/auth/admin/me        - Get admin profile
PUT  /api/v1/auth/admin/profile   - Update admin profile
```

### **👥 User Management Endpoints**
```
GET    /api/v1/admin/users                    - List all users
GET    /api/v1/admin/users/:id                - Get user details
POST   /api/v1/admin/users                    - Create new user
PUT    /api/v1/admin/users/:id                - Update user
DELETE /api/v1/admin/users/:id                - Delete user
POST   /api/v1/admin/users/:id/activate       - Activate user
POST   /api/v1/admin/users/:id/deactivate     - Deactivate user
POST   /api/v1/admin/users/:id/block          - Block user
POST   /api/v1/admin/users/:id/unblock        - Unblock user
```

### **🛡️ Admin Management Endpoints**
```
GET    /api/v1/admin/admins                   - List all admins
GET    /api/v1/admin/admins/:id               - Get admin details
POST   /api/v1/admin/admins                   - Create new admin
PUT    /api/v1/admin/admins/:id               - Update admin
DELETE /api/v1/admin/admins/:id               - Delete admin
POST   /api/v1/admin/admins/:id/roles         - Update admin roles
```

### **📊 Analytics & Dashboard Endpoints**
```
GET    /api/v1/admin/dashboard/stats          - Dashboard statistics
GET    /api/v1/admin/dashboard/analytics      - Analytics data
GET    /api/v1/admin/dashboard/recent-activity - Recent activity
GET    /api/v1/admin/dashboard/user-growth    - User growth data
GET    /api/v1/admin/dashboard/revenue        - Revenue analytics
```

### **⚙️ System Settings Endpoints**
```
GET    /api/v1/admin/settings                 - Get system settings
PUT    /api/v1/admin/settings                 - Update system settings
GET    /api/v1/admin/settings/email           - Email settings
PUT    /api/v1/admin/settings/email           - Update email settings
GET    /api/v1/admin/settings/oauth           - OAuth settings
PUT    /api/v1/admin/settings/oauth           - Update OAuth settings
```

### **📝 Content Management Endpoints**
```
GET    /api/v1/admin/content                  - List all content
GET    /api/v1/admin/content/:id              - Get content details
POST   /api/v1/admin/content                  - Create content
PUT    /api/v1/admin/content/:id              - Update content
DELETE /api/v1/admin/content/:id              - Delete content
POST   /api/v1/admin/content/:id/publish      - Publish content
POST   /api/v1/admin/content/:id/unpublish    - Unpublish content
```

### **🔒 Security & Logs Endpoints**
```
GET    /api/v1/admin/security/logs            - Security logs
GET    /api/v1/admin/security/audit           - Audit logs
GET    /api/v1/admin/security/sessions        - Active sessions
POST   /api/v1/admin/security/sessions/:id/terminate - Terminate session
```

## 🎨 Admin Panel Features

### **Dashboard Widgets**
- User Statistics
- Revenue Analytics
- Recent Activity
- System Health
- Quick Actions

### **User Management**
- User List with Search & Filter
- User Details Modal
- Bulk Actions (Activate/Deactivate/Delete)
- User Activity Timeline
- Role Management

### **Admin Management**
- Admin List
- Role Assignment
- Permission Management
- Admin Activity Log

### **System Settings**
- General Settings
- Email Configuration
- OAuth Settings
- Security Settings
- Backup & Restore

### **Content Management**
- Content Editor
- Media Library
- SEO Settings
- Publishing Workflow

## 🚀 Implementation Status

### **✅ Completed**
- [x] Admin login endpoint
- [x] User management endpoints
- [x] Basic dashboard endpoints
- [x] System settings endpoints

### **🔄 In Progress**
- [ ] Content management endpoints
- [ ] Security logs endpoints
- [ ] Advanced analytics
- [ ] Bulk operations

### **📋 Planned**
- [ ] Real-time notifications
- [ ] Advanced reporting
- [ ] API rate limiting
- [ ] Audit trail system
