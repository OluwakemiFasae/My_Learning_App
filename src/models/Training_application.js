'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Training_Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Training_Application.belongsTo(models.Employee, { foreignKey: 'empId' }),
        Training_Application.belongsTo(models.Training, {
          foreignKey: 'trainingId',
        })
    }
  }
  Training_Application.init(
    {
      empId: DataTypes.INTEGER,
      trainingId: DataTypes.INTEGER,
      appliedDate: DataTypes.DATE,
      status: DataTypes.STRING,
      completionStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Training_Application',
    }
  )
  return Training_Application
}
