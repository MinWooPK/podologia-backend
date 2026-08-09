import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al obtener el usuario",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const { name, email, phone, address, role, avatarUrl } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        role,
        avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return res.json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Usuario no encontrado",
    });
  }
};
