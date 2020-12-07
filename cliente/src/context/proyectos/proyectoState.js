import React, { useReducer } from "react";

import proyectoContext from "./proyectoContext";
import proyectoReducer from "./proyectoReducer";
import {
  FORMULARIO_PROYECTO,
  OBTENER_PROYECTOS,
  AGREGAR_PROYECTO,
  PROYECTO_ERROR,
  VALIDAR_FORMULARIO,
  PROYECTO_ACTUAL,
  ELIMINAR_PROYECTO,
} from "../../types";
import clienteAxios from "../../config/axios";
const ProyectoState = (props) => {
  // const proyectos = [
  //Estos datos vendran de una base de datos
  //arreglo de objetos
  // iteramos cada uno con map de ese arreglo
  //  { id: 1, nombre: "tienda virtual" },
  //  { id: 2, nombre: "Intranet" },
  //  { id: 3, nombre: "Diseño de sitio web" },
  //  { id: 4, nombre: "MERN" },
  // ];
  const initialState = {
    // nuevoProyecto: false //https://www.udemy.com/course/react-de-principiante-a-experto-creando-mas-de-10-aplicaciones/learn/lecture/17671034#questions
    proyectos: [], //areglo de objetos vacio
    formulario: false,
    errorformulario: false,
    proyecto: null,
    mensaje: null,
  };
  //Dispatch(envio) para ejecutar las acciones
  const [state, dispatch] = useReducer(proyectoReducer, initialState);
  // Serie de funciones para el CRUD (Create, Read, Update y Delete)
  const mostrarFormulario = () => {
    dispatch({
      type: FORMULARIO_PROYECTO,
    });
  };

  //Obtener los proyectos
  const obtenerProyectos = async () => {
    try {
      const resultado = await clienteAxios.get("/api/proyectos");
      //console.log(resultado);
      dispatch({
        type: OBTENER_PROYECTOS, //siempre lo que tome tu funcion como parametro va a ser el payload
        payload: resultado.data.proyectos,
      });
    } catch (error) {
      const alerta = {
        msg: "Hubo un error",
        categoria: "alerta-error",
      };

      dispatch({
        type: PROYECTO_ERROR,
        payload: alerta,
      });
    }
  };
  // Agregar nuevo proyecto
  const agregarProyecto = async (proyecto) => {
    //Insertar el proyecto en el state
    try {
      const resultado = await clienteAxios.post("/api/proyectos", proyecto);
      //console.log(resultado);
      dispatch({
        type: AGREGAR_PROYECTO,
        payload: resultado.data,
      });
    } catch (error) {
      const alerta = {
        msg: "Hubo un error",
        categoria: "alerta-error",
      };

      dispatch({
        type: PROYECTO_ERROR,
        payload: alerta,
      });
    }
  };
  // Valida el formulario por errores
  const mostrarError = () => {
    dispatch({
      type: VALIDAR_FORMULARIO,
    });
  };

  // Selecciona el proyecto que el usuario dio click
  const proyectoActual = (proyectoId) => {
    dispatch({
      type: PROYECTO_ACTUAL,
      payload: proyectoId,
    });
  };

  // Eliminar un proyecto
  const eliminarProyecto = async (proyectoId) => {
    try {
      await clienteAxios.delete(`/api/proyectos/${proyectoId}`);
      dispatch({
        type: ELIMINAR_PROYECTO,
        payload: proyectoId,
      });
    } catch (error) {
      const alerta = {
        msg: "Hubo un error",
        categoria: "alerta-error",
      };

      dispatch({
        type: PROYECTO_ERROR,
        payload: alerta,
      });
    }
  };

  return (
    <proyectoContext.Provider
      value={{
        proyectos: state.proyectos,
        formulario: state.formulario, //STATE una palabra todo en minuscula
        errorformulario: state.errorformulario,
        proyecto: state.proyecto,
        mensaje: state.mensaje,
        mostrarFormulario, // Funciones dos palabras una minuscula y otra MAYUSCULA
        obtenerProyectos,
        agregarProyecto,
        mostrarError,
        proyectoActual,
        eliminarProyecto,
      }}
    >
      {props.children}
    </proyectoContext.Provider>
  );
};

export default ProyectoState;
