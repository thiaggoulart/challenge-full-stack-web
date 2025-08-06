import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class Student extends Model {
  public ra!: string;
  public name!: string;
  public email!: string;
  public cpf!: string;
}

Student.init(
  {
    ra: {
      type: DataTypes.STRING(12),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true,
  }
);
