'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cpu', {
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
      model: {
        type: Sequelize.STRING
      },
      cores: {
        type: Sequelize.INTEGER
      },
      threads: {
        type: Sequelize.INTEGER
      },
      base_clock: {
        type: Sequelize.DECIMAL
      },
      boost_clock: {
        type: Sequelize.DECIMAL
      },
      socket: {
        type: Sequelize.STRING
      },
      tdp: {
        type: Sequelize.INTEGER
      },
      cache: {
        type: Sequelize.STRING
      },
      integrated_graphics: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Cpu');
  }
};