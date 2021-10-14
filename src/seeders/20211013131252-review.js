'use strict';

const reviews = require ('../mockdata/review_mock_data.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('Reviews', reviews);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
