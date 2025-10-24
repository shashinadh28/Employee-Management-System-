const { Leave, Employee, User } = require('../models');
const { Op } = require('sequelize');

// Get all leaves with pagination and search
const getLeaves = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = '',
      leaveType = '',
      employeeId = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {};
    const userWhereClause = {};
    
    if (search) {
      userWhereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (leaveType) {
      whereClause.leaveType = leaveType;
    }

    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    // If user is not admin/hr, only show their own leaves
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ where: { userId: req.user.id } });
      if (employee) {
        whereClause.employeeId = employee.id;
      }
    }

    const { count, rows: leaves } = await Leave.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'employeeId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email'],
            where: Object.keys(userWhereClause).length > 0 ? userWhereClause : undefined
          }]
        },
        {
          model: User,
          as: 'approver',
          attributes: ['firstName', 'lastName'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        leaves,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaves',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single leave by ID
const getLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          }]
        },
        {
          model: User,
          as: 'approver',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user can view this leave
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ where: { userId: req.user.id } });
      if (!employee || leave.employeeId !== employee.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: { leave }
    });
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new leave request
const createLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      isHalfDay = false,
      halfDayPeriod,
      emergencyContact,
      handoverNotes,
      attachments = []
    } = req.body;

    // Get employee record for the current user
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee record not found'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Leave start date cannot be in the past'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'Leave end date cannot be before start date'
      });
    }

    // Check for overlapping leaves
    const overlappingLeaves = await Leave.findAll({
      where: {
        employeeId: employee.id,
        status: { [Op.in]: ['pending', 'approved'] },
        [Op.or]: [
          {
            startDate: { [Op.between]: [startDate, endDate] }
          },
          {
            endDate: { [Op.between]: [startDate, endDate] }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });

    if (overlappingLeaves.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have a leave request for this period'
      });
    }

    // Check leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await Leave.getLeaveBalance(employee.id, leaveType, currentYear);
    
    const requestedDays = isHalfDay ? 0.5 : Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    if (leaveType !== 'unpaid' && leaveBalance.remaining < requestedDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. Available: ${leaveBalance.remaining} days, Requested: ${requestedDays} days`
      });
    }

    const leave = await Leave.create({
      employeeId: employee.id,
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason,
      isHalfDay,
      halfDayPeriod,
      emergencyContact,
      handoverNotes,
      attachments,
      status: 'pending'
    });

    // Fetch complete leave data
    const newLeave = await Leave.findByPk(leave.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: { leave: newLeave }
    });
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update leave request (only for pending leaves)
const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user can update this leave
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ where: { userId: req.user.id } });
      if (!employee || leave.employeeId !== employee.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Only pending leaves can be updated
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be updated'
      });
    }

    await leave.update(updateData);

    // Fetch updated leave data
    const updatedLeave = await Leave.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Leave request updated successfully',
      data: { leave: updatedLeave }
    });
  } catch (error) {
    console.error('Update leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Approve or reject leave request
const approveRejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected'
      });
    }

    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be approved or rejected'
      });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    await leave.update({
      status,
      approvedBy: req.user.id,
      approvedAt: new Date(),
      rejectionReason: status === 'rejected' ? rejectionReason : null
    });

    // Fetch updated leave data
    const updatedLeave = await Leave.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }]
        },
        {
          model: User,
          as: 'approver',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      message: `Leave request ${status} successfully`,
      data: { leave: updatedLeave }
    });
  } catch (error) {
    console.error('Approve/reject leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel leave request
const cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user can cancel this leave
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ where: { userId: req.user.id } });
      if (!employee || leave.employeeId !== employee.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    if (!leave.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'This leave request cannot be cancelled'
      });
    }

    await leave.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling leave request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get leave balance for an employee
const getLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year = new Date().getFullYear() } = req.query;

    // Check if user can view this employee's balance
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ where: { userId: req.user.id } });
      if (!employee || employee.id !== employeeId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const leaveTypes = ['annual', 'sick', 'personal', 'maternity', 'paternity', 'emergency', 'bereavement', 'study'];
    const balances = {};

    for (const leaveType of leaveTypes) {
      balances[leaveType] = await Leave.getLeaveBalance(employeeId, leaveType, year);
    }

    res.json({
      success: true,
      data: { balances, year: parseInt(year) }
    });
  } catch (error) {
    console.error('Get leave balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave balance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get leave statistics
const getLeaveStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const totalLeaves = await Leave.count({
      where: {
        startDate: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
          [Op.lte]: new Date(`${currentYear}-12-31`)
        }
      }
    });

    const leavesByStatus = await Leave.findAll({
      attributes: [
        'status',
        [Leave.sequelize.fn('COUNT', Leave.sequelize.col('id')), 'count']
      ],
      where: {
        startDate: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
          [Op.lte]: new Date(`${currentYear}-12-31`)
        }
      },
      group: ['status'],
      raw: true
    });

    const leavesByType = await Leave.findAll({
      attributes: [
        'leaveType',
        [Leave.sequelize.fn('COUNT', Leave.sequelize.col('id')), 'count']
      ],
      where: {
        startDate: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
          [Op.lte]: new Date(`${currentYear}-12-31`)
        }
      },
      group: ['leaveType'],
      raw: true
    });

    const pendingLeaves = await Leave.count({
      where: { status: 'pending' }
    });

    res.json({
      success: true,
      data: {
        totalLeaves,
        leavesByStatus,
        leavesByType,
        pendingLeaves,
        year: currentYear
      }
    });
  } catch (error) {
    console.error('Get leave stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  approveRejectLeave,
  cancelLeave,
  getLeaveBalance,
  getLeaveStats
};