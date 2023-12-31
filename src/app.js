import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";

const app = express();

//Configuración
app.set("port", 8000);

//Permitiendo llamadas http desde otras urls
const cors = require("cors");
const whiteList = [
    "http://localhost:4200"
];
app.use(cors({origin: whiteList})); 


app.use(express.json());

//Middleware para poder visualizar por consola las llamadas y respuestas http
app.use(morgan("dev"));

//Importamos las rutas que empleará la api
app.use('/api/users', userRoutes);

export default app