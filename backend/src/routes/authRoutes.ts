import { Router } from "express";
import {
  activateOrDeactivateUser,
  changePassword,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/authController";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//protected route
router.use(verifyJWT);
router.post("/logout", logoutUser);
router.post("/change-password", changePassword);
router.patch("/update-profile", updateProfile);
router.patch("/activate-deactivate-user", activateOrDeactivateUser);

export default router;
