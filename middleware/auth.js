/*
 Seccion de autentificacion middleware 
 */

const jwt = require("jsonwebtoken");
const { request } = require("express");

module.exports = function (req, res, next) {
  //  Leer el token del header
  const token = req.header("x-auth-token");

  //Revisar si no hay token
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no valido" });
  }

  //Validar el token

  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token No valido" });
  }
};
