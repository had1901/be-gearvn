'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vga', {
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
      gpu_model: {
        type: Sequelize.STRING
      },
      vram: {
        type: Sequelize.INTEGER
      },
      memory_type: {
        type: Sequelize.STRING
      },
      core_clock: {
        type: Sequelize.INTEGER
      },
      boost_clock: {
        type: Sequelize.INTEGER
      },
      tdp: {
        type: Sequelize.INTEGER
      },
      length_mm: {
        type: Sequelize.INTEGER
      },
      ports: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Vga');
  }
};