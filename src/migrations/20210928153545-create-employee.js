'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.BOOLEAN
      },
      phoneNo: {
        type: Sequelize.STRING
      },
      deptId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Departments',
          },
          key: 'id'
        },
        allowNull: false
      },
      jobtitle: {
        type: Sequelize.STRING
      },
      createdAt: {
        defaultValue: Sequelize.DATE.now(),
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Date.now(),
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employees');
  }
};