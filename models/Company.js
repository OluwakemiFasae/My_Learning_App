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
      // define association here
      Company.hasMany(models.Admin, {
        foreignKey: 'companyId'
      })
    }
  };
  Company.init({
    companyName: DataTypes.STRING,
    companyLogoUrl: DataTypes.STRING,
    companyEmailAd: DataTypes.STRING,
    companyContactNo: DataTypes.STRING,
    employeeNo: DataTypes.INTEGER,
    buildingNo: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};