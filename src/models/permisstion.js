'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permisstion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permisstion.belongsToMany(models.Role, { through: 'role_permisstion' })

    }
  }
  Permisstion.init({
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permisstion',
    freezeTableName: true

  });
  return Permisstion;
};