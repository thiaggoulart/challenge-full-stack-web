import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import studentRoutes from "./routes/studentRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/enrollments", enrollmentRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
