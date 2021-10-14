'use strict';

const applications = require ('../mockdata/training_application_data.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('Training_Applications', applications);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Training_Applications', null, {});
  }
};
