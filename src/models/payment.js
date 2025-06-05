'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, {foreignKey: 'user_id'})
    }
  }
  Payment.init({
    user_id: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    pay_method: DataTypes.STRING,
    status: DataTypes.STRING,
    date_pay: DataTypes.DATE,
    transaction_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payment',
    freezeTableName: true

  });
  return Payment;
};