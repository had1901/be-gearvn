'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ssd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ssd.hasMany(models.Product_config, { foreignKey: 'ssd_id' })

    }
  }
  Ssd.init({
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    storage: DataTypes.INTEGER,
    type: DataTypes.STRING,
    interface: DataTypes.STRING,
    read_speed: DataTypes.INTEGER,
    write_speed: DataTypes.INTEGER,
    warranty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ssd',
  });
  return Ssd;
};