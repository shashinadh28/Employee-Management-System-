const { Department, Employee, User } = require('../models');
const { Op } = require('sequelize');

// Get all departments with pagination and search
const getDepartments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
      status = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows: departments } = await Department.findAndCountAll({
      where: whereClause,
      include: [
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
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // Add employee count for each department
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await dept.countEmployees();
        return {
          ...dept.toJSON(),
          employeeCount
        };
      })
    );

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        departments: departmentsWithCount,
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
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching departments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single department by ID
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
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
          as: 'employees',
          attributes: ['id', 'employeeId', 'status'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }]
        }
      ]
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: { department }
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching department',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      code,
      managerId,
      budget,
      location
    } = req.body;

    // Check if department code already exists
    const existingDepartment = await Department.findOne({ where: { code } });
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Department code already exists'
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

    const department = await Department.create({
      name,
      description,
      code: code.toUpperCase(),
      managerId,
      budget,
      location,
      status: 'active'
    });

    // Fetch complete department data
    const newDepartment = await Department.findByPk(department.id, {
      include: [
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'employeeId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department: newDepartment }
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating department',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if new code conflicts with existing department
    if (updateData.code && updateData.code !== department.code) {
      const existingDepartment = await Department.findOne({ 
        where: { 
          code: updateData.code.toUpperCase(),
          id: { [Op.ne]: id }
        } 
      });
      if (existingDepartment) {
        return res.status(400).json({
          success: false,
          message: 'Department code already exists'
        });
      }
      updateData.code = updateData.code.toUpperCase();
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

    await department.update(updateData);

    // Fetch updated department data
    const updatedDepartment = await Department.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'employeeId'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: { department: updatedDepartment }
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating department',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has employees
    const employeeCount = await Employee.count({ 
      where: { 
        departmentId: id,
        status: { [Op.ne]: 'terminated' }
      } 
    });
    
    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with active employees. Please reassign employees first.'
      });
    }

    // Soft delete by updating status
    await department.update({ status: 'inactive' });

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting department',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get department statistics
const getDepartmentStats = async (req, res) => {
  try {
    const totalDepartments = await Department.count({ where: { status: 'active' } });
    
    const departmentEmployeeCounts = await Department.findAll({
      attributes: [
        'id',
        'name',
        'code',
        [Department.sequelize.fn('COUNT', Department.sequelize.col('employees.id')), 'employeeCount']
      ],
      include: [{
        model: Employee,
        as: 'employees',
        attributes: [],
        where: { status: 'active' },
        required: false
      }],
      where: { status: 'active' },
      group: ['Department.id'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalDepartments,
        departmentEmployeeCounts
      }
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching department statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
};