const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  //    Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    //   Crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);
    //  Guardar el creador via JWT
    proyecto.creador = req.usuario.id;
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al intentar crear un proyecto");
  }
};
//        Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al obtener un proyecto");
  }
};
//  Actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
  //    Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //    Extraer la información del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id); //await para hacer consultas a la base de datos

    // Si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(404).json({ msg: "No Autorizado lo siento" });
    }
    // actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

// Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id); //await para hacer consultas a la base de datos

    // Si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // Verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(404).json({ msg: "No Autorizado lo siento" });
    }
    // Eliminar el proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id }); //en mongo el id empieza con un guion bajo
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log("error");
    res.status(500).send("Error en el servidor");
  }
};
