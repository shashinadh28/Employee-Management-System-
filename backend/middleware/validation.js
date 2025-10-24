const { body, validationResult, param, query } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validation rules
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('role')
    .optional()
    .isIn(['admin', 'hr', 'manager', 'employee'])
    .withMessage('Invalid role'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  handleValidationErrors
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  handleValidationErrors
];

// Employee validation rules
const validateEmployee = [
  body('userId')
    .isUUID()
    .withMessage('Valid user ID is required'),
  
  body('departmentId')
    .isUUID()
    .withMessage('Valid department ID is required'),
  
  body('roleId')
    .isUUID()
    .withMessage('Valid role ID is required'),
  
  body('managerId')
    .optional()
    .isUUID()
    .withMessage('Manager ID must be a valid UUID'),
  
  body('dateOfBirth')
    .optional()
    .isDate()
    .withMessage('Please provide a valid date of birth'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender'),
  
  body('maritalStatus')
    .optional()
    .isIn(['single', 'married', 'divorced', 'widowed'])
    .withMessage('Invalid marital status'),
  
  body('hireDate')
    .isDate()
    .withMessage('Please provide a valid hire date'),
  
  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Salary must be a number'),
  
  body('workLocation')
    .optional()
    .isIn(['office', 'remote', 'hybrid'])
    .withMessage('Invalid work location'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'terminated', 'on_leave'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Employee update validation rules (all fields optional)
const validateEmployeeUpdate = [
  body('userId')
    .optional()
    .isUUID()
    .withMessage('Valid user ID is required'),
  
  body('departmentId')
    .optional()
    .isUUID()
    .withMessage('Valid department ID is required'),
  
  body('roleId')
    .optional()
    .isUUID()
    .withMessage('Valid role ID is required'),
  
  body('managerId')
    .optional()
    .isUUID()
    .withMessage('Manager ID must be a valid UUID'),
  
  body('dateOfBirth')
    .optional()
    .isDate()
    .withMessage('Please provide a valid date of birth'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Invalid gender'),
  
  body('maritalStatus')
    .optional()
    .isIn(['single', 'married', 'divorced', 'widowed'])
    .withMessage('Invalid marital status'),
  
  body('hireDate')
    .optional()
    .isDate()
    .withMessage('Please provide a valid hire date'),
  
  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Salary must be a number'),
  
  body('workLocation')
    .optional()
    .isIn(['office', 'remote', 'hybrid'])
    .withMessage('Invalid work location'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'terminated', 'on_leave'])
    .withMessage('Invalid status')
];

// Department validation rules
const validateDepartment = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Department code is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Department code must be between 2 and 10 characters')
    .isAlphanumeric()
    .withMessage('Department code must contain only letters and numbers'),
  
  body('managerId')
    .optional()
    .isUUID()
    .withMessage('Manager ID must be a valid UUID'),
  
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Department update validation rules (all fields optional)
const validateDepartmentUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('code')
    .optional()
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage('Department code must be between 2 and 10 characters')
    .isAlphanumeric()
    .withMessage('Department code must contain only letters and numbers'),
  
  body('managerId')
    .optional()
    .isUUID()
    .withMessage('Manager ID must be a valid UUID'),
  
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status')
];

// Role validation rules
const validateRole = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Role title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Role title must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('departmentId')
    .isUUID()
    .withMessage('Valid department ID is required'),
  
  body('level')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Level must be between 1 and 10'),
  
  body('minSalary')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number'),
  
  body('maxSalary')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
  
  handleValidationErrors
];

// Role update validation rules (all fields optional)
const validateRoleUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Role title must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('departmentId')
    .optional()
    .isUUID()
    .withMessage('Valid department ID is required'),
  
  body('level')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Level must be between 1 and 10'),
  
  body('minSalary')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number'),
  
  body('maxSalary')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status')
];

// Leave validation
const validateLeave = [
  body('leaveType')
    .isIn(['annual', 'sick', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement', 'study', 'unpaid'])
    .withMessage('Invalid leave type'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('isHalfDay')
    .optional()
    .isBoolean()
    .withMessage('isHalfDay must be a boolean'),
  body('halfDayPeriod')
    .optional()
    .isIn(['morning', 'afternoon'])
    .withMessage('Half day period must be morning or afternoon'),
  body('emergencyContact')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Emergency contact must not exceed 200 characters'),
  body('handoverNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Handover notes must not exceed 1000 characters')
];

const validateLeaveUpdate = [
  body('leaveType')
    .optional()
    .isIn(['annual', 'sick', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement', 'study', 'unpaid'])
    .withMessage('Invalid leave type'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('reason')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
  body('isHalfDay')
    .optional()
    .isBoolean()
    .withMessage('isHalfDay must be a boolean'),
  body('halfDayPeriod')
    .optional()
    .isIn(['morning', 'afternoon'])
    .withMessage('Half day period must be morning or afternoon'),
  body('emergencyContact')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Emergency contact must not exceed 200 characters'),
  body('handoverNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Handover notes must not exceed 1000 characters')
];

const validateLeaveApproval = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be approved or rejected'),
  body('rejectionReason')
    .if(body('status').equals('rejected'))
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason is required and must be between 10 and 500 characters')
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Sort by must be a string'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// UUID parameter validation function
const validateUUID = (paramName = 'id') => [
  param(paramName)
    .isUUID()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

module.exports = {
  // Authentication validation
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  
  // Employee validation
  validateEmployee,
  validateEmployeeUpdate,
  
  // Department validation
  validateDepartment,
  validateDepartmentUpdate,
  
  // Role validation
  validateRole,
  validateRoleUpdate,
  
  // Leave validation
  validateLeave,
  validateLeaveUpdate,
  validateLeaveApproval,
  
  // General validation
  validatePagination,
  validateUUID,
  handleValidationErrors
};