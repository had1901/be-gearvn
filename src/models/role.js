'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'role_id' })
      Role.hasMany(models.Role_permisstion, { foreignKey: 'role_id' })
      Role.belongsToMany(models.Permisstion, {
        through: models.Role_permisstion,
        foreignKey: 'role_id',         // ✅ khóa ngoại trỏ từ Role_permission -> Role
        otherKey: 'permisstion_id',    // ✅ khóa ngoại trỏ từ Role_permission -> Permisstion
      })
    }
  }
  Role.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
    freezeTableName: true
  });
  return Role;
};