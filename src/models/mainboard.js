'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mainboard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mainboard.hasMany(models.Product_config, { foreignKey: 'mainboard_id' })
    }
  }
  Mainboard.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    chipset: DataTypes.STRING,
    socket: DataTypes.STRING,
    form_factor: DataTypes.STRING,
    ram_slots: DataTypes.INTEGER,
    max_ram: DataTypes.INTEGER,
    ram_type: DataTypes.STRING,
    pcie_slots: DataTypes.INTEGER,
    storage_support: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mainboard',
    freezeTableName: true

  });
  return Mainboard;
};