'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Training_Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      empId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Employees',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false
      },
      trainingId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Trainings',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false
      },
      appliedDate: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
      },
      completionStatus: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Training_Applications')
  },
}
