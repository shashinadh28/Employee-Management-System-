// Role-based permission system
export const PERMISSIONS = {
  // Employee Management
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_READ: 'employee:read',
  EMPLOYEE_UPDATE: 'employee:update',
  EMPLOYEE_DELETE: 'employee:delete',
  EMPLOYEE_READ_ALL: 'employee:read_all',
  EMPLOYEE_READ_SELF: 'employee:read_self',
  
  // Department Management
  DEPARTMENT_CREATE: 'department:create',
  DEPARTMENT_READ: 'department:read',
  DEPARTMENT_UPDATE: 'department:update',
  DEPARTMENT_DELETE: 'department:delete',
  
  // Leave Management
  LEAVE_CREATE: 'leave:create',
  LEAVE_READ: 'leave:read',
  LEAVE_UPDATE: 'leave:update',
  LEAVE_DELETE: 'leave:delete',
  LEAVE_APPROVE: 'leave:approve',
  LEAVE_READ_ALL: 'leave:read_all',
  LEAVE_READ_SELF: 'leave:read_self',
  
  // Role Management
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',
  
  // System Administration
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_USERS: 'system:users',
  SYSTEM_ANALYTICS: 'system:analytics',
  
  // Reports and Analytics
  REPORTS_HR: 'reports:hr',
  REPORTS_FINANCIAL: 'reports:financial',
  REPORTS_PERFORMANCE: 'reports:performance',
  REPORTS_ATTENDANCE: 'reports:attendance',
  
  // Profile Management
  PROFILE_UPDATE_SELF: 'profile:update_self',
  PROFILE_UPDATE_ANY: 'profile:update_any',
  PROFILE_READ_SELF: 'profile:read_self',
  PROFILE_READ_ANY: 'profile:read_any',
  
  // Performance Management
  PERFORMANCE_CREATE: 'performance:create',
  PERFORMANCE_READ: 'performance:read',
  PERFORMANCE_UPDATE: 'performance:update',
  PERFORMANCE_READ_SELF: 'performance:read_self',
  
  // Training and Development
  TRAINING_CREATE: 'training:create',
  TRAINING_READ: 'training:read',
  TRAINING_ASSIGN: 'training:assign',
  TRAINING_ENROLL_SELF: 'training:enroll_self',
  
  // Notifications
  NOTIFICATION_SEND: 'notification:send',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_MANAGE: 'notification:manage'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  admin: [
    // Full system access
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_READ_ALL,
    
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.DEPARTMENT_UPDATE,
    PERMISSIONS.DEPARTMENT_DELETE,
    
    PERMISSIONS.LEAVE_CREATE,
    PERMISSIONS.LEAVE_READ,
    PERMISSIONS.LEAVE_UPDATE,
    PERMISSIONS.LEAVE_DELETE,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_READ_ALL,
    
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.ROLE_ASSIGN,
    
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.SYSTEM_USERS,
    PERMISSIONS.SYSTEM_ANALYTICS,
    
    PERMISSIONS.REPORTS_HR,
    PERMISSIONS.REPORTS_FINANCIAL,
    PERMISSIONS.REPORTS_PERFORMANCE,
    PERMISSIONS.REPORTS_ATTENDANCE,
    
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.PROFILE_UPDATE_ANY,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_READ_ANY,
    
    PERMISSIONS.PERFORMANCE_CREATE,
    PERMISSIONS.PERFORMANCE_READ,
    PERMISSIONS.PERFORMANCE_UPDATE,
    
    PERMISSIONS.TRAINING_CREATE,
    PERMISSIONS.TRAINING_READ,
    PERMISSIONS.TRAINING_ASSIGN,
    
    PERMISSIONS.NOTIFICATION_SEND,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_MANAGE
  ],
  
  hr: [
    // HR management access
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_READ,
    PERMISSIONS.EMPLOYEE_UPDATE,
    PERMISSIONS.EMPLOYEE_READ_ALL,
    
    PERMISSIONS.DEPARTMENT_READ,
    PERMISSIONS.DEPARTMENT_UPDATE,
    
    PERMISSIONS.LEAVE_READ,
    PERMISSIONS.LEAVE_APPROVE,
    PERMISSIONS.LEAVE_READ_ALL,
    
    PERMISSIONS.ROLE_READ,
    
    PERMISSIONS.REPORTS_HR,
    PERMISSIONS.REPORTS_PERFORMANCE,
    PERMISSIONS.REPORTS_ATTENDANCE,
    
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.PROFILE_READ_ANY,
    
    PERMISSIONS.PERFORMANCE_CREATE,
    PERMISSIONS.PERFORMANCE_READ,
    PERMISSIONS.PERFORMANCE_UPDATE,
    
    PERMISSIONS.TRAINING_CREATE,
    PERMISSIONS.TRAINING_READ,
    PERMISSIONS.TRAINING_ASSIGN,
    
    PERMISSIONS.NOTIFICATION_SEND,
    PERMISSIONS.NOTIFICATION_READ
  ],
  
  employee: [
    // Limited self-service access
    PERMISSIONS.EMPLOYEE_READ_SELF,
    
    PERMISSIONS.DEPARTMENT_READ,
    
    PERMISSIONS.LEAVE_CREATE,
    PERMISSIONS.LEAVE_READ_SELF,
    
    PERMISSIONS.PROFILE_UPDATE_SELF,
    PERMISSIONS.PROFILE_READ_SELF,
    
    PERMISSIONS.PERFORMANCE_READ_SELF,
    
    PERMISSIONS.TRAINING_READ,
    PERMISSIONS.TRAINING_ENROLL_SELF,
    
    PERMISSIONS.NOTIFICATION_READ
  ]
};

// Utility functions
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || 'employee';
};

export const getUserPermissions = (role = null) => {
  const userRole = role || getUserRole();
  return ROLE_PERMISSIONS[userRole] || [];
};

export const hasPermission = (permission, role = null) => {
  const permissions = getUserPermissions(role);
  return permissions.includes(permission);
};

export const hasAnyPermission = (permissionList, role = null) => {
  const permissions = getUserPermissions(role);
  return permissionList.some(permission => permissions.includes(permission));
};

export const hasAllPermissions = (permissionList, role = null) => {
  const permissions = getUserPermissions(role);
  return permissionList.every(permission => permissions.includes(permission));
};

// Permission-based component wrapper
export const withPermission = (Component, requiredPermission) => {
  return (props) => {
    if (!hasPermission(requiredPermission)) {
      return null; // Return null instead of JSX for access denied
    }
    return Component(props);
  };
};

// Check if user can access a specific route
export const canAccessRoute = (routePath, role = null) => {
  const userRole = role || getUserRole();
  
  const routePermissions = {
    '/employees': [PERMISSIONS.EMPLOYEE_READ, PERMISSIONS.EMPLOYEE_READ_ALL],
    '/departments': [PERMISSIONS.DEPARTMENT_READ],
    '/roles': [PERMISSIONS.ROLE_READ],
    '/leaves': [PERMISSIONS.LEAVE_READ, PERMISSIONS.LEAVE_READ_ALL, PERMISSIONS.LEAVE_READ_SELF],
    '/reports': [PERMISSIONS.REPORTS_HR, PERMISSIONS.REPORTS_PERFORMANCE, PERMISSIONS.REPORTS_ATTENDANCE],
    '/settings': [PERMISSIONS.SYSTEM_CONFIG, PERMISSIONS.PROFILE_UPDATE_SELF]
  };
  
  const requiredPermissions = routePermissions[routePath];
  if (!requiredPermissions) return true; // Allow access to routes without specific permissions
  
  return hasAnyPermission(requiredPermissions, userRole);
};

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getUserRole,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  withPermission,
  canAccessRoute
};