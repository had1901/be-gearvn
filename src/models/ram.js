'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ram.hasMany(models.Product_config, { foreignKey: 'ram_id' })

    }
  }
  Ram.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    storage: DataTypes.INTEGER,
    type: DataTypes.STRING,
    speed: DataTypes.INTEGER,
    modules: DataTypes.INTEGER,
    latency: DataTypes.STRING,
    voltage: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Ram',
    freezeTableName: true

  });
  return Ram;
};