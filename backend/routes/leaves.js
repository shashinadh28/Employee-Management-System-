const express = require('express');
const router = express.Router();
const {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  approveRejectLeave,
  cancelLeave,
  getLeaveBalance,
  getLeaveStats
} = require('../controllers/leaveController');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  validateLeave,
  validateLeaveUpdate,
  validateLeaveApproval,
  validateUUID,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get leave statistics (admin/hr only)
router.get('/stats', 
  authorize(['admin', 'hr']), 
  getLeaveStats
);

// Get leave balance for an employee
router.get('/balance/:employeeId',
  validateUUID('employeeId'),
  handleValidationErrors,
  getLeaveBalance
);

// Get all leaves with pagination and search
router.get('/',
  validatePagination,
  handleValidationErrors,
  getLeaves
);

// Get single leave by ID
router.get('/:id',
  validateUUID('id'),
  handleValidationErrors,
  getLeave
);

// Create new leave request
router.post('/',
  validateLeave,
  handleValidationErrors,
  createLeave
);

// Update leave request (only pending leaves)
router.put('/:id',
  validateUUID('id'),
  validateLeaveUpdate,
  handleValidationErrors,
  updateLeave
);

// Approve or reject leave request (admin/hr/manager only)
router.patch('/:id/approve-reject',
  validateUUID('id'),
  validateLeaveApproval,
  handleValidationErrors,
  authorize(['admin', 'hr', 'manager']),
  approveRejectLeave
);

// Cancel leave request
router.patch('/:id/cancel',
  validateUUID('id'),
  handleValidationErrors,
  cancelLeave
);

module.exports = router;