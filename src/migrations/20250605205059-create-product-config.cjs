'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Product_config', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product',
          key: 'id'
        }
      },
      cpu_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'cpu',
          key: 'id'
        }
      },
      ram_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ram',
          key: 'id'
        }
      },
      ssd_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ssd',
          key: 'id'
        }
      },
      vga_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vga',
          key: 'id'
        }
      },
      mainboard_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'mainboard',
          key: 'id'
        }
      },
      psu_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'psu',
          key: 'id'
        }
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
    await queryInterface.dropTable('Product_config');
  }
};