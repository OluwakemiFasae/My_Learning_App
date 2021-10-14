const depts = require ('../mockdata/deptdata2.json')

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('Departments', depts);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Departments', null, {});
  }
};