'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {foreignKey: 'user_id'})
      Order.hasMany(models.Order_detail, {foreignKey: 'order_id'})
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    order_code: DataTypes.STRING,
    username: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    genre: DataTypes.STRING,
    total_price: DataTypes.INTEGER,
    ship_cod: DataTypes.STRING,
    discount: DataTypes.INTEGER,
    shipping_address: DataTypes.STRING,
    pay_method: DataTypes.STRING,
    status_payment: DataTypes.STRING,
    status_transpost: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    freezeTableName: true,
    tableName: 'order',

  });
  return Order;
};