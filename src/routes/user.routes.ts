import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
// import { authMiddleware } from "../middleware/auth.middleware";
// import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

// router.get("/", authMiddleware, adminMiddleware, getUsers);
router.get("/", getUsers);
export default router;
