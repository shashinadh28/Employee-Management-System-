const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
} = require('../controllers/departmentController');
const {
  validateDepartment,
  validatePagination,
  validateUUID
} = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get department statistics (accessible to all authenticated users)
router.get('/stats', getDepartmentStats);

// Get all departments with pagination and search
router.get('/', validatePagination, getDepartments);

// Get single department by ID
router.get('/:id', validateUUID, getDepartment);

// Create new department (HR and Admin only)
router.post('/', authorize('admin', 'hr'), validateDepartment, createDepartment);

// Update department (HR and Admin only)
router.put('/:id', authorize('admin', 'hr'), validateUUID, validateDepartment, updateDepartment);

// Delete department (Admin only)
router.delete('/:id', authorize('admin'), validateUUID, deleteDepartment);

module.exports = router;