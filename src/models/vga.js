'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vga.hasMany(models.Product_config, { foreignKey: 'vga_id' })

    }
  }
  Vga.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    gpu_model: DataTypes.STRING,
    vram: DataTypes.INTEGER,
    memory_type: DataTypes.STRING,
    core_clock: DataTypes.INTEGER,
    boost_clock: DataTypes.INTEGER,
    tdp: DataTypes.INTEGER,
    length_mm: DataTypes.INTEGER,
    ports: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vga',
    freezeTableName: true

  });
  return Vga;
};