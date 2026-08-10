import { Router } from "express";

import {
  getShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
} from "../controllers/shop.controller";

const router = Router();

router.get("/", getShops);
router.get("/:id", getShopById);
router.post("/", createShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);

export default router;
