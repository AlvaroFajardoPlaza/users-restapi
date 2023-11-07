import { Router } from "express";
import { methods as userController } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get("/", userController.getAllUsers)

//Segunda prueba de registro de usuarios
userRoutes.post("/register", userController.register);

// Ruta de login de usuario
userRoutes.post("/login", userController.login);

export default userRoutes;