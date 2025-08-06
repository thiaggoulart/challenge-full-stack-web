import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { Student } from "./Student";

export class Enrollment extends Model {
  public id!: number;
  public studentRa!: string;
  public course!: string;
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentRa: {
      type: DataTypes.STRING(12),
      allowNull: false,
      references: {
        model: Student,
        key: "ra",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Enrollment",
    tableName: "enrollments",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentRa", "course"],
      },
    ],
  }
);

Student.hasMany(Enrollment, { foreignKey: "studentRa", sourceKey: "ra" });
Enrollment.belongsTo(Student, { foreignKey: "studentRa", targetKey: "ra" });
