import { Router } from "express";
import { methods as userController } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get("/", userController.getAllUsers) 

export default userRoutes;