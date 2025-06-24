'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: 'category_id'})
      Product.belongsTo(models.Brand, { foreignKey: 'brand_id'})
      Product.hasMany(models.Product_images, { foreignKey: 'product_id'})
      Product.hasMany(models.Cart_item, { foreignKey: 'product_id'})
      Product.hasMany(models.Order_detail, { foreignKey: 'product_id'})
    }
  }
  Product.init({
    category_id: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    content: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    price: DataTypes.INTEGER,
    sale_price: DataTypes.INTEGER,
    flash_sale: DataTypes.BOOLEAN,
    sale_percent: DataTypes.BOOLEAN,
    stock_quantity: DataTypes.INTEGER,
    rating_count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product',
    freezeTableName: true

  });
  return Product;
};