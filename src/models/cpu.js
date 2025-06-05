'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cpu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cpu.hasMany(models.Product_config, { foreignKey: 'cpu_id' })
    }
  }
  Cpu.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    cores: DataTypes.INTEGER,
    threads: DataTypes.INTEGER,
    base_clock: DataTypes.DECIMAL,
    boost_clock: DataTypes.DECIMAL,
    socket: DataTypes.STRING,
    tdp: DataTypes.INTEGER,
    cache: DataTypes.STRING,
    integrated_graphics: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Cpu',
    freezeTableName: true

  });
  return Cpu;
};