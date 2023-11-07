import { getConnection } from "../database/database";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'secretKey';

//Llamada a todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        //Solicitamos la conexión:
        const connection = await getConnection()
        //Una vez tenemos la conexión, pedimos la query a la tabla de nuestra BBDD en MYSQL
        const result = await connection.query('SELECT * FROM users')
        await res.status(200).json(result);
    } catch(error) {
        res.status(500).send("Ha ocurrido un error: ", error.message);
    }
}

//llamada a un usuario por su id
const findById = async(req, res) => {
    try {
        console.log(req.params);
        const { userId } = req.params
        const connection = await getConnection()
        const result = await connection.query("SELECT * FROM users WHERE id=?", userId);
        res.satus(200).json(result)
    } catch(error) {
        res.status(500).send("Ha ocurrido un error: ", error.message);
    }

}

const findByEmail = async(req, res) => {
    try {
        console.log(req.body)
        const userEmail = req.body.email
        const connection = await getConnection()
        const result = await connection.query("SELECT FROM users WHERE email=?", userEmail);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send("Ha ocurrido un error: ", error.message)
    }
}

//Registro de nuevos usuarios. Hay que comprobar si el usuario ya existe
// const register1 = async(req, res) => {
//     // Solicitamos la conexión a la base de datos
//     const connection = await getConnection()
    
//     // Creamos la consulta de post que lanzaremos a la BBDD SQL.
//     const sqlQuery = 'INSERT INTO users (`username`, `email`, `password`) VALUES (?)'

//     //Necesitamos recibir los valores del req.body
//     console.log(req.body);
//     const values = [
//         req.body.username,
//         req.body.email,
//         req.body.password
//     ];
//     const registerResult = await connection.query(sqlQuery, [values], (error, data) => {
//         if(error) {
//             res.status(500).send("Ha ocurrido un error: ", error.message)
//         } else {
//             res.status(200).json(data)
//         }
//     })
// };


// Segunda prueba de registro de usuarios: 
const register = async(req, res) => {
    try {
        const { username, email, password } = req.body

        //Comprobar que están todos los valores...
        if(!(username || email || password)){
            res.status(400).send("Bad request. You need to fill in the form.");
        };

        //Conseguimos la conexión con la BBDD SQL
        const connection = await getConnection();

        // Comprobamos que el usuario no existe en la BBDD
        const userEmail = req.body.email
        const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', userEmail)
        if(existingUser.length > 0){
            res.status(400).send("El usuario ya existe en la BBDD.");
            return;
        }

        // Encriptamos la contraseña
        const encryptedPassword = await bcrypt.hash(password, 10);
        
        await connection.query('INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)', [username, email, encryptedPassword])
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword
        }

        //Creamos el token del usuario para navegar identificado
        const userToken = jwt.sign(
            newUser,
            secret,
            {
                expiresIn: "2h",
            }
        );
        
        res.status(201).send({
            message: "New user registered!,",
            token: userToken,
        })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


// Login de usuario
const login = async (req, res) => {
    // Lo primero es comprobar el cuerpo de la petición
    const { email, password } = req.body
    try {
        const connection = await getConnection();
        //Comprobamos la existencia del usuario
        const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', email)
        
        if(!existingUser.length) return res.status(400).send({msg: "Este usuario no está registrado."});
        
        console.log("La matriz de usuario recibida de MYSQL es: ", existingUser);
        // Extraemos el primer elemento de la matriz de resultados
        const existingUserObject = existingUser[0];
        console.log("El objeto de usuario que estamos pasando es: ", existingUserObject);
        console.log("La contraseña introducida es: ", password);
        const passwordHashed = existingUserObject.password;

        // Comprobamos la validez de la contraseña con bcrypt.compare
        const matchedPassword = await bcrypt.compare(password, passwordHashed)
        if(!matchedPassword) return res.status(400).send({msg: "La contraseña no es correcta"});

        const loggedUser = {
            email: req.body.email,
            password: passwordHashed
        }

        // Creamos el token que vamos a asignar al usuario loggeado
        const userToken = jwt.sign( 
            loggedUser, 
            secret, 
            { expiresIn: "2h"} 
        );

        res.status(201).send({
            login: true,
            userToken
        })

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const methods = {
    getAllUsers,
    findById,
    findByEmail,
    register,
    login,
}