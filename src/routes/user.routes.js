import { Router } from "express";
import { methods as userController } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get("/", userController.getAllUsers)

//Segunda prueba de registro de usuarios
userRoutes.post("/register2", userController.register2);

export default userRoutes;