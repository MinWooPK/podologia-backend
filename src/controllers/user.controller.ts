import { Request, Response } from "express";
import prisma from "../config/prisma";

interface UserParams {
  id: string;
}

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(users);
};

export const getUserById = async (req: Request<UserParams>, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  return res.json(user);
};

export const updateUser = async (req: Request<UserParams>, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address, role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        role,
      },
    });

    return res.json(user);
  } catch {
    return res.status(404).json({
      message: "Usuario no encontrado",
    });
  }
};

export const deleteUser = async (req: Request<UserParams>, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch {
    return res.status(404).json({
      message: "Usuario no encontrado",
    });
  }
};
