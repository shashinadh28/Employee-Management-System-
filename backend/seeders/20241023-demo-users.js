'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const hashedPasswordHR = await bcrypt.hash('hr123', 12);
    const hashedPasswordEmp = await bcrypt.hash('emp123', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@company.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: 'HR',
        lastName: 'Manager',
        email: 'hr@company.com',
        password: hashedPasswordHR,
        phone: '+1234567891',
        role: 'hr',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: 'John',
        lastName: 'Employee',
        email: 'employee@company.com',
        password: hashedPasswordEmp,
        phone: '+1234567892',
        role: 'employee',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['admin@company.com', 'hr@company.com', 'employee@company.com']
      }
    }, {});
  }
};