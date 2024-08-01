import express from "express"
import { AuthController } from "./auth.controllers";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "@prisma/client";


const router = express.Router();

router.post('/login', AuthController.logInUser)

router.get('/refresh-token', AuthController.refreshToken)

router.get('/change-password',auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPERADMIN), AuthController.changePassword)

router.get('/forget-password', AuthController.forgetPassword)

router.get('/reset-password', AuthController.resetPassword)

export const AuthRoutes = router;