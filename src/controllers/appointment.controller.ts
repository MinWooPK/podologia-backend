import { Request, Response } from "express";
import prisma from "../config/prisma";

// ==============================
// OBTENER TODAS LAS CITAS
// ==============================

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        service: true,
        note: true,
        patientId: true,

        patient: {
          select: {
            id: true,
            name: true,
            surname: true,
            dni: true,
            phone: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },

      orderBy: [
        {
          date: "asc",
        },
        {
          startTime: "asc",
        },
      ],
    });

    return res.json(appointments);
  } catch (error) {
    console.error("Error al obtener las citas:", error);

    return res.status(500).json({
      message: "Error al obtener las citas",
    });
  }
};
// ==============================
// OBTENER LAS ÚLTIMAS 4 CITAS DE UNA FECHA
// ==============================

export const getRecentAppointmentsByDate = async (
  req: Request,
  res: Response,
) => {
  const { date } = req.params;

  try {
    if (!date) {
      return res.status(400).json({
        message: "La fecha es obligatoria",
      });
    }

    // Inicio del día
    const startOfDay = new Date(`${date}T00:00:00`);

    // Inicio del día siguiente
    const endOfDay = new Date(`${date}T23:59:59.999`);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },

      select: {
        id: true,
        startTime: true,
        service: true,
        isPending: true,

        patient: {
          select: {
            name: true,
            surname: true,
          },
        },
      },

      orderBy: {
        startTime: "desc",
      },

      take: 4,
    });

    return res.json(appointments);
  } catch (error) {
    console.error("Error al obtener las últimas citas de la fecha:", error);

    return res.status(500).json({
      message: "Error al obtener las citas",
    });
  }
};
// ==============================
// OBTENER CITA POR ID
// ==============================

export const getAppointmentById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },

      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        service: true,
        note: true,
        patientId: true,

        patient: {
          select: {
            id: true,
            name: true,
            surname: true,
            dni: true,
            email: true,
            phone: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    return res.json(appointment);
  } catch (error) {
    console.error("Error al obtener la cita:", error);

    return res.status(500).json({
      message: "Error al obtener la cita",
    });
  }
};

// ==============================
// CREAR CITA
// ==============================

export const createAppointment = async (req: Request, res: Response) => {
  const { date, startTime, endTime, service, note, patientId } = req.body;

  try {
    // ==============================
    // VALIDACIONES
    // ==============================

    if (!date || !startTime || !endTime || !service || !patientId) {
      return res.status(400).json({
        message:
          "Fecha, hora de inicio, hora de fin, servicio y paciente son obligatorios",
      });
    }

    // ==============================
    // COMPROBAR PACIENTE
    // ==============================

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: "Paciente no encontrado",
      });
    }

    // ==============================
    // COMPROBAR HORARIO
    // ==============================

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "La hora de inicio debe ser anterior a la hora de fin",
      });
    }

    // ==============================
    // CREAR CITA
    // ==============================

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        service,
        note: note || null,
        patientId,
      },

      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        service: true,
        note: true,
        patientId: true,

        patient: {
          select: {
            id: true,
            name: true,
            surname: true,
            dni: true,
            email: true,
            phone: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(appointment);
  } catch (error) {
    console.error("Error al crear la cita:", error);

    return res.status(500).json({
      message: "Error al crear la cita",
    });
  }
};

// ==============================
// ACTUALIZAR CITA
// ==============================

export const updateAppointment = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const { date, startTime, endTime, service, note, patientId } = req.body;

  try {
    if (!date || !startTime || !endTime || !service || !patientId) {
      return res.status(400).json({
        message:
          "Fecha, hora de inicio, hora de fin, servicio y paciente son obligatorios",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "La hora de inicio debe ser anterior a la hora de fin",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: "Paciente no encontrado",
      });
    }

    const appointment = await prisma.appointment.update({
      where: {
        id,
      },

      data: {
        date: new Date(date),
        startTime,
        endTime,
        service,
        note: note || null,
        patientId,
      },

      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        service: true,
        note: true,
        patientId: true,

        patient: {
          select: {
            id: true,
            name: true,
            surname: true,
            dni: true,
            email: true,
            phone: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(appointment);
  } catch (error) {
    console.error("Error al actualizar la cita:", error);

    return res.status(404).json({
      message: "Cita no encontrada",
    });
  }
};

// ==============================
// ELIMINAR CITA
// ==============================

export const deleteAppointment = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    await prisma.appointment.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Cita eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);

    return res.status(404).json({
      message: "Cita no encontrada",
    });
  }
};
