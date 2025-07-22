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
      Role_permisstion.belongsTo(models.Role, { foreignKey: 'role_id' })
      Role_permisstion.belongsTo(models.Permisstion, { foreignKey: 'permisstion_id' })

    }
  }
  Role_permisstion.init({
    role_id: DataTypes.INTEGER,
    permisstion_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role_permisstion',
    freezeTableName: true,
    tableName: 'role_permisstion',
  });
  return Role_permisstion;
};