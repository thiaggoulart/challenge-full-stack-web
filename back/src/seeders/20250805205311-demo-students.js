'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});

    await queryInterface.bulkInsert('students', [
      { name: 'Thiago Goulart', email: 'thiago1@test.com', ra: 'RA1001', cpf: '12345678901', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Maria Silva', email: 'maria.silva@test.com', ra: 'RA1002', cpf: '12345678902', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Carlos Pereira', email: 'carlos@test.com', ra: 'RA1003', cpf: '12345678903', createdAt: new Date(), updatedAt: new Date() },
      { name: 'João Souza', email: 'joao@test.com', ra: 'RA1004', cpf: '12345678904', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ana Costa', email: 'ana@test.com', ra: 'RA1005', cpf: '12345678905', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fernanda Lima', email: 'fernanda@test.com', ra: 'RA1006', cpf: '12345678906', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ricardo Alves', email: 'ricardo@test.com', ra: 'RA1007', cpf: '12345678907', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Juliana Rocha', email: 'juliana@test.com', ra: 'RA1008', cpf: '12345678908', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Paulo Mendes', email: 'paulo@test.com', ra: 'RA1009', cpf: '12345678909', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Camila Torres', email: 'camila@test.com', ra: 'RA1010', cpf: '12345678910', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('students', null, {});
  }
};
