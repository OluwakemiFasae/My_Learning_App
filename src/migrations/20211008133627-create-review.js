'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      body: {
        type: Sequelize.STRING,
      },
      empId: { type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Employees',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false 
      },
      trainingId: { type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Trainings',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false 
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
    await queryInterface.dropTable('Reviews')
  },
}
