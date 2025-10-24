const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getRoleStats
} = require('../controllers/roleController');
const {
  validateRole,
  validatePagination,
  validateUUID
} = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get role statistics (accessible to all authenticated users)
router.get('/stats', getRoleStats);

// Get all roles with pagination and search
router.get('/', validatePagination, getRoles);

// Get single role by ID
router.get('/:id', validateUUID, getRole);

// Create new role (HR and Admin only)
router.post('/', authorize('admin', 'hr'), validateRole, createRole);

// Update role (HR and Admin only)
router.put('/:id', authorize('admin', 'hr'), validateUUID, validateRole, updateRole);

// Delete role (Admin only)
router.delete('/:id', authorize('admin'), validateUUID, deleteRole);

module.exports = router;