import { Router } from "express";

const userRoutes = Router()

userRoutes.get("/", (req, res) => {
    console.log('Ruta de usuarios inicial...')
})

export default userRoutes;