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
      Permisstion.hasMany(models.Role_permisstion, { foreignKey: 'permisstion_id' })
      Permisstion.belongsToMany(models.Role, {
        through: models.Role_permisstion,
        foreignKey: 'permisstion_id',  // ✅ trỏ từ Role_permission -> Permisstion
        otherKey: 'role_id',           // ✅ trỏ từ Role_permission -> Role
      })
    }
  }
  Permisstion.init({
    action: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permisstion',
    freezeTableName: true,
    tableName: 'permisstion',
  });
  return Permisstion;
};