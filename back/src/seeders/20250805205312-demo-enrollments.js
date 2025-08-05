'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('enrollments', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE enrollments_id_seq RESTART WITH 1;');

    const students = await queryInterface.sequelize.query(
      'SELECT id FROM students ORDER BY id ASC LIMIT 10;',
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

    const enrollments = students.map((s, i) => ({
      studentId: s.id,
      course: courses[i],
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('enrollments', enrollments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('enrollments', null, {});
  }
};
