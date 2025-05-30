import { Router } from "express";
import {
  getNearbyUsers,
  loginUser,
  logOut,
  registerUser,
} from "../controllers/userController";
import { isAuthorized } from "../middlewares/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/nearby", isAuthorized, getNearbyUsers);
router.post("/logout", isAuthorized, logOut);

export default router;
