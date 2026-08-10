import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getShops = async (req: Request, res: Response) => {
  try {
    const shops = await prisma.shop.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        price: true,
        imageUrl: true,
        inStock: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(shops);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al obtener los artículos",
    });
  }
};

export const getShopById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    const shop = await prisma.shop.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        price: true,
        imageUrl: true,
        inStock: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!shop) {
      return res.status(404).json({
        message: "Artículo no encontrado",
      });
    }

    return res.json(shop);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al obtener el artículo",
    });
  }
};

export const createShop = async (req: Request, res: Response) => {
  const { title, subtitle, description, price, imageUrl, inStock } = req.body;

  try {
    if (!title || !description || price === undefined) {
      return res.status(400).json({
        message: "Título, descripción y precio son obligatorios",
      });
    }

    const shop = await prisma.shop.create({
      data: {
        title,
        subtitle,
        description,
        price: Number(price),
        imageUrl,
        inStock: inStock ?? true,
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        price: true,
        imageUrl: true,
        inStock: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(shop);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al crear el artículo",
    });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const { title, subtitle, description, price, imageUrl, inStock } = req.body;

  try {
    const shop = await prisma.shop.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        price: Number(price),
        imageUrl,
        inStock,
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        price: true,
        imageUrl: true,
        inStock: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json(shop);
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Artículo no encontrado",
    });
  }
};

export const deleteShop = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  try {
    await prisma.shop.delete({
      where: { id },
    });

    return res.json({
      message: "Artículo eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Artículo no encontrado",
    });
  }
};
