const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');
const {
  validateEmployee,
  validatePagination,
  validateUUID
} = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get employee statistics (accessible to all authenticated users)
router.get('/stats', getEmployeeStats);

// Get all employees with pagination and search
router.get('/', validatePagination, getEmployees);

// Get single employee by ID
router.get('/:id', validateUUID, getEmployee);

// Create new employee (HR and Admin only)
router.post('/', authorize('admin', 'hr'), validateEmployee, createEmployee);

// Update employee (HR and Admin only)
router.put('/:id', authorize('admin', 'hr'), validateUUID, validateEmployee, updateEmployee);

// Delete employee (Admin only)
router.delete('/:id', authorize('admin'), validateUUID, deleteEmployee);

module.exports = router;