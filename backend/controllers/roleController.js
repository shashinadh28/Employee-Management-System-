const { Role, Department, Employee, User } = require('../models');
const { Op } = require('sequelize');

// Get all roles with pagination and search
const getRoles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'title',
      sortOrder = 'asc',
      department = '',
      status = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {};
    const departmentWhereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (department) {
      departmentWhereClause.name = { [Op.iLike]: `%${department}%` };
    }

    const { count, rows: roles } = await Role.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
          where: Object.keys(departmentWhereClause).length > 0 ? departmentWhereClause : undefined
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // Add employee count for each role
    const rolesWithCount = await Promise.all(
      roles.map(async (role) => {
        const employeeCount = await role.countEmployees();
        return {
          ...role.toJSON(),
          employeeCount
        };
      })
    );

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      success: true,
      data: {
        roles: rolesWithCount,
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
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single role by ID
const getRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department'
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

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: { role }
    });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new role
const createRole = async (req, res) => {
  try {
    const {
      title,
      description,
      departmentId,
      level,
      minSalary,
      maxSalary,
      responsibilities,
      requirements,
      skills
    } = req.body;

    // Verify department exists
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Validate salary range
    if (minSalary && maxSalary && parseFloat(minSalary) > parseFloat(maxSalary)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }

    const role = await Role.create({
      title,
      description,
      departmentId,
      level,
      minSalary,
      maxSalary,
      responsibilities,
      requirements,
      skills,
      status: 'active'
    });

    // Fetch complete role data
    const newRole = await Role.findByPk(role.id, {
      include: [
        {
          model: Department,
          as: 'department'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role: newRole }
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Verify department if being updated
    if (updateData.departmentId) {
      const department = await Department.findByPk(updateData.departmentId);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    // Validate salary range if being updated
    const minSalary = updateData.minSalary || role.minSalary;
    const maxSalary = updateData.maxSalary || role.maxSalary;
    if (minSalary && maxSalary && parseFloat(minSalary) > parseFloat(maxSalary)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot be greater than maximum salary'
      });
    }

    await role.update(updateData);

    // Fetch updated role data
    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: { role: updatedRole }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role has employees
    const employeeCount = await Employee.count({ 
      where: { 
        roleId: id,
        status: { [Op.ne]: 'terminated' }
      } 
    });
    
    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role with active employees. Please reassign employees first.'
      });
    }

    // Soft delete by updating status
    await role.update({ status: 'inactive' });

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get role statistics
const getRoleStats = async (req, res) => {
  try {
    const totalRoles = await Role.count({ where: { status: 'active' } });
    
    const roleEmployeeCounts = await Role.findAll({
      attributes: [
        'id',
        'title',
        'level',
        [Role.sequelize.fn('COUNT', Role.sequelize.col('employees.id')), 'employeeCount']
      ],
      include: [
        {
          model: Employee,
          as: 'employees',
          attributes: [],
          where: { status: 'active' },
          required: false
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name']
        }
      ],
      where: { status: 'active' },
      group: ['Role.id', 'department.id'],
      raw: true
    });

    const rolesByLevel = await Role.findAll({
      attributes: [
        'level',
        [Role.sequelize.fn('COUNT', Role.sequelize.col('id')), 'count']
      ],
      where: { status: 'active' },
      group: ['level'],
      order: [['level', 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalRoles,
        roleEmployeeCounts,
        rolesByLevel
      }
    });
  } catch (error) {
    console.error('Get role stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching role statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getRoleStats
};