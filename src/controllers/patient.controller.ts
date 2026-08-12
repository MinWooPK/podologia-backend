import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/patients
export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los pacientes",
    });
  }
};

// GET /api/patients/:id
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: "Paciente no encontrado",
      });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el paciente",
    });
  }
};

// POST /api/patients
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, surname, dni, email, phone, birthDate, address } = req.body;

    if (!name || !surname || !dni) {
      return res.status(400).json({
        message: "Nombre, apellidos y DNI son obligatorios",
      });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: {
        dni,
      },
    });

    if (existingPatient) {
      return res.status(409).json({
        message: "Ya existe un paciente con ese DNI",
      });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        surname,
        dni,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        address,
      },
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear el paciente",
    });
  }
};

// PUT /api/patients/:id
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { name, surname, dni, email, phone, birthDate, address, active } =
      req.body;

    const patient = await prisma.patient.update({
      where: {
        id,
      },
      data: {
        name,
        surname,
        dni,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        address,
        active,
      },
    });

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar el paciente",
    });
  }
};

// DELETE /api/patients/:id
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.patient.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Paciente eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar el paciente",
    });
  }
};
