'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    level: {
      type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'),
      defaultValue: 'entry'
    },
    minSalary: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    maxSalary: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    responsibilities: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    requirements: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'roles',
    timestamps: true,
    indexes: [
      {
        fields: ['departmentId']
      },
      {
        fields: ['level']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Instance methods
  Role.prototype.getEmployeeCount = async function() {
    const Employee = sequelize.models.Employee;
    return await Employee.count({
      where: { roleId: this.id }
    });
  };

  Role.prototype.getSalaryRange = function() {
    return {
      min: parseFloat(this.minSalary),
      max: parseFloat(this.maxSalary),
      currency: 'USD'
    };
  };

  // Associations
  Role.associate = function(models) {
    Role.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });
    
    Role.hasMany(models.Employee, {
      foreignKey: 'roleId',
      as: 'employees'
    });
  };

  return Role;
};