'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart_item.belongsTo(models.Product, {foreignKey: 'product_id', as: 'product'})
      Cart_item.belongsTo(models.User, {foreignKey: 'user_id'})
    }
  }
  Cart_item.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart_item',
    freezeTableName: true,
    tableName: 'cart_item',

  });
  return Cart_item;
};