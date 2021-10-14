const company = require ('../mockdata/company2.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('Companies', company);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Companies', null, {});
  }
};