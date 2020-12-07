// Rutas para Authenticar usuarios

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Iniciar sesión

// api/ath

router.post("/", authController.autenticarUsuario);
// Obtiene el usuario autenticado

router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
