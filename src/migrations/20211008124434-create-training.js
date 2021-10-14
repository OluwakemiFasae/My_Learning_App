'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Trainings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      companyId: { type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Companies',
          },
          key: 'id'
        },
        allowNull: false 
      },
      topic: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },
      unitCost: { type: Sequelize.STRING },
      location: { type: Sequelize.STRING },
      time: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },

      createdAt: {
        defaultValue: Date.now(),
        type: Sequelize.DATE,
      },
      updatedAt: {
        defaultValue: Date.now(),
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Trainings')
  },
}
