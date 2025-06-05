'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_permisstion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role_permisstion.init({
    role_id: DataTypes.INTEGER,
    permisstion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role_permisstion',
    freezeTableName: true

  });
  return Role_permisstion;
};