import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Student } from "./Student";

interface EnrollmentAttributes {
  id?: number;
  course: string;
  studentId: number;
}

export class Enrollment extends Model<EnrollmentAttributes> implements EnrollmentAttributes {
  public id!: number;
  public course!: string;
  public studentId!: number;
}

Enrollment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course: { type: DataTypes.STRING, allowNull: false, defaultValue: "Ciencia da computacao" },
    studentId: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, tableName: "enrollments" }
);

Student.hasMany(Enrollment, { foreignKey: "studentId" });
Enrollment.belongsTo(Student, { foreignKey: "studentId" });
