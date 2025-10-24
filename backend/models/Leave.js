'use strict';

module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id'
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
    leaveType: {
      type: DataTypes.ENUM(
        'annual', 'sick', 'maternity', 'paternity', 'personal', 
        'emergency', 'bereavement', 'study', 'unpaid'
      ),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 500]
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      defaultValue: 'pending'
    },
    approvedBy: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approvedAt: {
      type: DataTypes.DATE
    },
    rejectionReason: {
      type: DataTypes.TEXT
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isHalfDay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    halfDayPeriod: {
      type: DataTypes.ENUM('morning', 'afternoon'),
      allowNull: true
    },
    emergencyContact: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    handoverNotes: {
      type: DataTypes.TEXT
    },
    returnDate: {
      type: DataTypes.DATEONLY
    },
    actualReturnDate: {
      type: DataTypes.DATEONLY
    }
  }, {
    tableName: 'leaves',
    timestamps: true,
    indexes: [
      {
        fields: ['employeeId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['leaveType']
      },
      {
        fields: ['startDate', 'endDate']
      }
    ],
    hooks: {
      beforeCreate: (leave) => {
        // Calculate total days
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        
        if (leave.isHalfDay && daysDiff === 1) {
          leave.totalDays = 0.5;
        } else {
          leave.totalDays = daysDiff;
        }
        
        // Set return date (next working day after end date)
        const returnDate = new Date(end);
        returnDate.setDate(returnDate.getDate() + 1);
        leave.returnDate = returnDate;
      },
      beforeUpdate: (leave) => {
        if (leave.changed('startDate') || leave.changed('endDate') || leave.changed('isHalfDay')) {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const timeDiff = end.getTime() - start.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
          
          if (leave.isHalfDay && daysDiff === 1) {
            leave.totalDays = 0.5;
          } else {
            leave.totalDays = daysDiff;
          }
        }
        
        // Set approval timestamp
        if (leave.changed('status') && (leave.status === 'approved' || leave.status === 'rejected')) {
          leave.approvedAt = new Date();
        }
      }
    }
  });

  // Instance methods
  Leave.prototype.getDuration = function() {
    return {
      days: this.totalDays,
      isHalfDay: this.isHalfDay,
      period: this.halfDayPeriod
    };
  };

  Leave.prototype.isOverlapping = async function(otherLeave) {
    const thisStart = new Date(this.startDate);
    const thisEnd = new Date(this.endDate);
    const otherStart = new Date(otherLeave.startDate);
    const otherEnd = new Date(otherLeave.endDate);
    
    return (thisStart <= otherEnd && thisEnd >= otherStart);
  };

  Leave.prototype.canBeApproved = function() {
    return this.status === 'pending';
  };

  Leave.prototype.canBeCancelled = function() {
    return ['pending', 'approved'].includes(this.status) && 
           new Date(this.startDate) > new Date();
  };

  // Class methods
  Leave.getLeaveBalance = async function(employeeId, leaveType, year = new Date().getFullYear()) {
    const approvedLeaves = await Leave.findAll({
      where: {
        employeeId,
        leaveType,
        status: 'approved',
        startDate: {
          [sequelize.Sequelize.Op.gte]: new Date(`${year}-01-01`),
          [sequelize.Sequelize.Op.lte]: new Date(`${year}-12-31`)
        }
      }
    });

    const totalUsed = approvedLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
    
    // Default leave entitlements (can be made configurable)
    const entitlements = {
      annual: 21,
      sick: 10,
      personal: 5,
      maternity: 90,
      paternity: 14,
      emergency: 3,
      bereavement: 3,
      study: 5,
      unpaid: 365 // No limit for unpaid leave
    };

    return {
      entitled: entitlements[leaveType] || 0,
      used: totalUsed,
      remaining: Math.max(0, (entitlements[leaveType] || 0) - totalUsed)
    };
  };

  // Associations
  Leave.associate = function(models) {
    Leave.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
    
    Leave.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Leave.belongsTo(models.User, {
      foreignKey: 'approvedBy',
      as: 'approver'
    });
  };

  return Leave;
};