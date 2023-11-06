import { getConnection } from "../database/database";

//Llamada a todos los usuarios
const getAllUsers = async (req, res) => {
    try{
        const connection = await getConnection()
        const result = await connection.query('SELECT * FROM users')
        await res.status(200).json(result);
    } catch(error) {
        res.status(500).send("Ha ocurrido un error: ", error.message);
    }
}

const findById = async(req, res) => {

}

const register = async(req, res) => {

}

const login = async(req, res) => {
    
}

export const methods = {
    getAllUsers,
}