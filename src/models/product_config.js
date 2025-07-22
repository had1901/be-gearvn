'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_config extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_config.belongsTo(models.Cpu, { foreignKey: 'cpu_id' })
      Product_config.belongsTo(models.Ram, { foreignKey: 'ram_id' })
      Product_config.belongsTo(models.Mainboard, { foreignKey: 'mainboard_id' })
      Product_config.belongsTo(models.Psu, { foreignKey: 'psu_id' })
      Product_config.belongsTo(models.Ssd, { foreignKey: 'ssd_id' })
      Product_config.belongsTo(models.Vga, { foreignKey: 'vga_id' })
    }
  }
  Product_config.init({
    product_id: DataTypes.INTEGER,
    cpu_id: DataTypes.INTEGER,
    ram_id: DataTypes.INTEGER,
    ssd_id: DataTypes.INTEGER,
    vga_id: DataTypes.INTEGER,
    mainboard_id: DataTypes.INTEGER,
    psu_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product_config',
    tableName: 'product_config',
    freezeTableName: true
  });
  return Product_config;
};