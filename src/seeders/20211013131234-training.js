'use strict';

const trainings = require ('../mockdata/training_mock_data.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('Trainings', trainings);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Trainings', null, {});
  }
};
