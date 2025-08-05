import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

interface StudentAttributes {
  id?: number;
  name: string;
  email: string;
  ra: string;
  cpf: string;
}

export class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public ra!: string;
  public cpf!: string;
}

Student.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    ra: { type: DataTypes.STRING, allowNull: false, unique: true },
    cpf: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
  { sequelize, tableName: "students" }
);
