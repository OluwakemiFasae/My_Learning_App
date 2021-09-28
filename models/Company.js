'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
      Company.hasMany(models.Department, {
        foreignKey: 'companyId'
      })
    }
  };
  Company.init({
    companyName: DataTypes.STRING,
    logoUrl: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    contactNo: DataTypes.STRING,
    employeeSize: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};