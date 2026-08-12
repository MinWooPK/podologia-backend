import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import userShop from "./routes/shop.routes";
import patientRoutes from "./routes/patient.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL as string],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shop", userShop);
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;
