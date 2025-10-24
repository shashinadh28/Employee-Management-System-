'use strict';

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    managerId: {
      type: DataTypes.UUID,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      allowNull: true
    },
    maritalStatus: {
      type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed'),
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    emergencyContact: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    terminationDate: {
      type: DataTypes.DATEONLY
    },
    salary: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    workSchedule: {
      type: DataTypes.STRING,
      defaultValue: 'full-time'
    },
    workLocation: {
      type: DataTypes.ENUM('office', 'remote', 'hybrid'),
      defaultValue: 'office'
    },
    bankDetails: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    documents: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    certifications: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    education: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    workExperience: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    performanceRating: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 5
      }
    },
    notes: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'terminated', 'on_leave'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'employees',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['employeeId']
      },
      {
        unique: true,
        fields: ['userId']
      },
      {
        fields: ['departmentId']
      },
      {
        fields: ['roleId']
      },
      {
        fields: ['managerId']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Instance methods
  Employee.prototype.getFullName = function() {
    return this.User ? this.User.getFullName() : 'Unknown';
  };

  Employee.prototype.getAge = function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  Employee.prototype.getYearsOfService = function() {
    if (!this.hireDate) return 0;
    const today = new Date();
    const hireDate = new Date(this.hireDate);
    return Math.floor((today - hireDate) / (365.25 * 24 * 60 * 60 * 1000));
  };

  Employee.prototype.isManager = function() {
    return this.managerId === null;
  };

  // Class methods
  Employee.generateEmployeeId = async function() {
    const currentYear = new Date().getFullYear();
    const prefix = `EMP${currentYear}`;
    
    const lastEmployee = await Employee.findOne({
      where: {
        employeeId: {
          [sequelize.Sequelize.Op.like]: `${prefix}%`
        }
      },
      order: [['employeeId', 'DESC']]
    });

    let nextNumber = 1;
    if (lastEmployee) {
      const lastNumber = parseInt(lastEmployee.employeeId.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  };

  // Associations
  Employee.associate = function(models) {
    Employee.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Employee.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });
    
    Employee.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role'
    });
    
    Employee.belongsTo(models.Employee, {
      foreignKey: 'managerId',
      as: 'manager'
    });
    
    Employee.hasMany(models.Employee, {
      foreignKey: 'managerId',
      as: 'subordinates'
    });
    
    Employee.hasMany(models.Leave, {
      foreignKey: 'employeeId',
      as: 'leaves'
    });
  };

  return Employee;
};