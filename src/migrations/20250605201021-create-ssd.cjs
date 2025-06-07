'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ssd', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      brand: {
        type: Sequelize.STRING
      },
      storage: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      interface: {
        type: Sequelize.STRING
      },
      read_speed: {
        type: Sequelize.INTEGER
      },
      write_speed: {
        type: Sequelize.INTEGER
      },
      warranty: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ssd');
  }
};