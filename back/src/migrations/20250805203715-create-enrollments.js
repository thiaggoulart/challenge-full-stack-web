'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enrollments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      studentRa: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'students', key: 'ra' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      course: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  uniqueKeys: {
    unique_student_course: {
      fields: ["studentRa", "course"],
    },
  },
  async down(queryInterface) {
    await queryInterface.dropTable('enrollments');
  },
};
