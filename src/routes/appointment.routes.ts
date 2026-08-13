import { Router } from "express";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getRecentAppointmentsByDate,
} from "../controllers/appointment.controller";

const router = Router();

// Obtener todas las citas
router.get("/", getAppointments);

// Obtener una cita
router.get("/:id", getAppointmentById);

// Crear una cita
router.post("/", createAppointment);

// Actualizar una cita
router.put("/:id", updateAppointment);

// Eliminar una cita
router.delete("/:id", deleteAppointment);

router.get("/date/:date/recent", getRecentAppointmentsByDate);
export default router;
