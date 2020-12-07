//  enviar un Request req.body
const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //  Revisar si hay errores

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Extraer email y password
  const { email, password } = req.body;

  try {
    // Revisar que el usuario registrado sea unico

    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "Este Usuario ya existe" });
    }
    //crea un nuevo usuario
    usuario = new Usuario(req.body);

    //Hasshear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar el nuevo usuario
    await usuario.save();

    //Crear y firmar el JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600, // 1 hora,
      },
      (error, token) => {
        if (error) throw error;
        //Mensaje de confimación usuario
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error ni pex");
  }
};
