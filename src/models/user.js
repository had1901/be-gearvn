'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: 'role_id' })
      User.hasMany(models.Order, { foreignKey: 'user_id' })
      User.hasMany(models.Payment, {foreignKey: 'user_id'})
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    avatar: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  
console.log('Table name:', User.getTableName());
  return User;
};