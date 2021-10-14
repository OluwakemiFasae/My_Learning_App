'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Training extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Training.belongsTo(models.Company, {
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      }),
        Training.hasMany(models.Training_Application, {
          foreignKey: 'trainingId'
        })
    }
  }
  Training.init(
    {
      companyId: DataTypes.INTEGER,
      topic: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: { type: DataTypes.DATE, defaultValue: new Date() },
      endDate: DataTypes.DATE,
      unitCost: DataTypes.STRING,
      location: DataTypes.STRING,
      time: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Training',
    }
  )
  return Training
}
