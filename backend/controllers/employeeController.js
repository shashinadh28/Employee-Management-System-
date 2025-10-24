const { Employee, User, Department, Role } = require('../models');
const { Op } = require('sequelize');

// Get all employees with pagination, search, and sorting
const getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      department = '',
      role = '',
      status = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause for search
    const whereClause = {};
    const userWhereClause = {};
    const departmentWhereClause = {};
    const roleWhereClause = {};

    // Search functionality
    if (search) {
      userWhereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by department
    if (department) {
      departmentWhereClause.name = { [Op.iLike]: `%${department}%` };
    }

    // Filter by role
    if (role) {
      roleWhereClause.title = { [Op.iLike]: `%${role}%` };
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Build order clause
    const orderClause = [];
    if (sortBy === 'name') {
      orderClause.push([{ model: User, as: 'user' }, 'firstName', sortOrder.toUpperCase()]);
    } else if (sortBy === 'department') {
      orderClause.push([{ model: Department, as: 'department' }, 'name', sortOrder.toUpperCase()]);
    } else if (sortBy === 'role') {
      orderClause.push([{ model: Role, as: 'role' }, 'title', sortOrder.toUpperCase()]);
    } else {
      orderClause.push([sortBy, sortOrder.toUpperCase()]);
    }

    const { count, rows: employees } = await Employee.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
          where: Object.keys(userWhereClause).length > 0 ? userWhereClause : undefined
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
          where: Object.keys(departmentWhereClause).length > 0 ? departmentWhereClause : undefined
        },
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'title', 'level'],
          where: Object.keys(roleWhereClause).length > 0 ? roleWhereClause : undefined
        },
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'employeeId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset,
      order: orderClause,
      distinct: true
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        employees,
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
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employees',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single employee by ID
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Department,
          as: 'department'
        },
        {
          model: Role,
          as: 'role'
        },
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'employeeId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }]
        },
        {
          model: Employee,
          as: 'subordinates',
          attributes: ['id', 'employeeId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }]
        }
      ]
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: { employee }
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const {
      userId,
      departmentId,
      roleId,
      managerId,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      address,
      emergencyContact,
      hireDate,
      salary,
      workSchedule,
      workLocation,
      bankDetails,
      skills,
      certifications,
      education,
      workExperience,
      notes
    } = req.body;

    // Check if user exists and is not already an employee
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingEmployee = await Employee.findOne({ where: { userId } });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'User is already an employee'
      });
    }

    // Verify department and role exist
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Verify manager exists if provided
    if (managerId) {
      const manager = await Employee.findByPk(managerId);
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: 'Manager not found'
        });
      }
    }

    // Generate employee ID
    const employeeId = await Employee.generateEmployeeId();

    // Create employee
    const employee = await Employee.create({
      employeeId,
      userId,
      departmentId,
      roleId,
      managerId,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      address,
      emergencyContact,
      hireDate,
      salary,
      workSchedule,
      workLocation,
      bankDetails,
      skills,
      certifications,
      education,
      workExperience,
      notes,
      status: 'active'
    });

    // Fetch complete employee data
    const newEmployee = await Employee.findByPk(employee.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Department,
          as: 'department'
        },
        {
          model: Role,
          as: 'role'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { employee: newEmployee }
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Verify department and role if being updated
    if (updateData.departmentId) {
      const department = await Department.findByPk(updateData.departmentId);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    if (updateData.roleId) {
      const role = await Role.findByPk(updateData.roleId);
      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      }
    }

    // Verify manager if being updated
    if (updateData.managerId) {
      const manager = await Employee.findByPk(updateData.managerId);
      if (!manager) {
        return res.status(404).json({
          success: false,
          message: 'Manager not found'
        });
      }
    }

    // Update employee
    await employee.update(updateData);

    // Fetch updated employee data
    const updatedEmployee = await Employee.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Department,
          as: 'department'
        },
        {
          model: Role,
          as: 'role'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: { employee: updatedEmployee }
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if employee has subordinates
    const subordinates = await Employee.findAll({ where: { managerId: id } });
    if (subordinates.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete employee with subordinates. Please reassign subordinates first.'
      });
    }

    // Soft delete by updating status
    await employee.update({ status: 'terminated', terminationDate: new Date() });

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get employee statistics
const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.count({ where: { status: 'active' } });
    const totalDepartments = await Department.count({ where: { status: 'active' } });
    const totalRoles = await Role.count({ where: { status: 'active' } });
    
    const employeesByDepartment = await Employee.findAll({
      attributes: [
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('Employee.id')), 'count']
      ],
      include: [{
        model: Department,
        as: 'department',
        attributes: ['name']
      }],
      where: { status: 'active' },
      group: ['department.id', 'department.name'],
      raw: true
    });

    const employeesByStatus = await Employee.findAll({
      attributes: [
        'status',
        [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        totalRoles,
        employeesByDepartment,
        employeesByStatus
      }
    });
  } catch (error) {
    console.error('Get employee stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
};