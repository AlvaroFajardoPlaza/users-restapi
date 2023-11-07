// En este archivo nos encargaremos de crear, verificar y guardar el token que recibe el usuario en el almacenamiento local
import jwt from 'jsonwebtoken';
const mySecret = 'secretKeyRandom';

// Función para generar un nuevo token de usuario
const createToken = (user) => {
    return jwt.sign(user, mySecret, { expiresIn: "2h"})
};

//Función para verificar el token de un usuario loggeado
const verifyToken = (token) => {
    jwt.verify(token, mySecret);
}

// Función para guardar un token encriptado en el almacenamiento local
const saveTokenToLocalStorage = async (token) => {
    const encryptedToken = await crypto.encrypt(mySecret, token)
    localStorage.setItem("token", encryptedToken);
};

// Autenticando a un usuario
const authRequired = (req, res, next) => {
    // console.log('req.token', req.headers.authorization)
    const token = req.headers.authorization || false;

    if (!token) return res.status(401).json({message:"No hay token, no está autorizado"});

    jwt.verify(token, mySecret,(error, user) => {
        if (error) return res.status(403).json({message:"Token inválido"});
        req.user = user
        req.token = token
        console.log("req.user decodificado: ", req.user)
        next();
    })
};

module.exports = {
    authRequired,
    createToken,
    verifyToken,
    saveTokenToLocalStorage
};