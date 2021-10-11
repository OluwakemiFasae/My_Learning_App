'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Employee, { foreignKey: 'empId' }),
        Review.belongsTo(models.Training, {
          foreignKey: 'trainingId',
        })
    }
  }
  Review.init(
    {
      body: DataTypes.STRING,
      empId: DataTypes.INTEGER,
      trainingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Review',
    }
  )
  return Review
}
