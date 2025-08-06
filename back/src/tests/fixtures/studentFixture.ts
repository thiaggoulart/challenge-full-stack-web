export const validStudentData = {
  name: "João Silva",
  email: "joao@example.com",
  cpf: "12345678901",
  ra: "RA123456"
};

export const invalidStudentData = {
  name: 123, 
  email: "not-an-email",
  cpf: "000",
  ra: "!"
};

export const partialStudentUpdate = {
  email: "joao.silva@newmail.com"
};
