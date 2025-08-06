'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('enrollments', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE enrollments_id_seq RESTART WITH 1;');

    const students = await queryInterface.sequelize.query(
      'SELECT ra FROM students ORDER BY ra ASC LIMIT 10;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const courses = [
      'Programação Web',
      'Banco de Dados Avançado',
      'Engenharia de Usabilidade',
      'Algoritmos e Estruturas',
      'Lógica Matemática',
      'Desenvolvimento Front-End',
      'Desenvolvimento Back-End',
      'Segurança da Informação',
      'Big Data e IoT',
      'Gestão de Projetos'
    ];

    const enrollments = students.map((student, index) => ({
      studentRa: student.ra,
      course: courses[index],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('enrollments', enrollments, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('enrollments', null, {});
  }
};
