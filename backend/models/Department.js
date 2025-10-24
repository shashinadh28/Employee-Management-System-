'use strict';

module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 10],
        isUppercase: true
      }
    },
    managerId: {
      type: DataTypes.UUID,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'departments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        unique: true,
        fields: ['code']
      }
    ]
  });

  // Instance methods
  Department.prototype.getEmployeeCount = async function() {
    const Employee = sequelize.models.Employee;
    return await Employee.count({
      where: { departmentId: this.id }
    });
  };

  // Associations
  Department.associate = function(models) {
    Department.hasMany(models.Employee, {
      foreignKey: 'departmentId',
      as: 'employees'
    });
    
    Department.belongsTo(models.Employee, {
      foreignKey: 'managerId',
      as: 'manager'
    });
    
    Department.hasMany(models.Role, {
      foreignKey: 'departmentId',
      as: 'roles'
    });
  };

  return Department;
};