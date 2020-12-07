const mongoose = require("mongoose");

// Creamos el Schemma de usuarios
const UsuariosSchema = mongoose.Schema({
  nombre: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  registro: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Usuario", UsuariosSchema);
