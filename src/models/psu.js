'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Psu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Psu.hasMany(models.Product_config, { foreignKey: 'psu_id' })

    }
  }
  Psu.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    power: DataTypes.INTEGER,
    efficiency: DataTypes.STRING,
    modular: DataTypes.BOOLEAN,
    form_factor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Psu',
    freezeTableName: true

  });
  return Psu;
};