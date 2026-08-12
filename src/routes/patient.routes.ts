import { Router } from "express";

import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller";

const router = Router();

// GET /api/patients
router.get("/", getPatients);

// GET /api/patients/:id
router.get("/:id", getPatientById);

// POST /api/patients
router.post("/", createPatient);

// PUT /api/patients/:id
router.put("/:id", updatePatient);

// DELETE /api/patients/:id
router.delete("/:id", deletePatient);

export default router;
