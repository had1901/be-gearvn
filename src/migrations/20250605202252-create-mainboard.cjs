'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mainboard', {
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
      chipset: {
        type: Sequelize.STRING
      },
      socket: {
        type: Sequelize.STRING
      },
      form_factor: {
        type: Sequelize.STRING
      },
      ram_slots: {
        type: Sequelize.INTEGER
      },
      max_ram: {
        type: Sequelize.INTEGER
      },
      ram_type: {
        type: Sequelize.STRING
      },
      pcie_slots: {
        type: Sequelize.INTEGER
      },
      storage_support: {
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
    await queryInterface.dropTable('Mainboard');
  }
};