import Swal from "sweetalert2";
import { UserApi } from "../../types";
import { Capitalize } from "../capitalize/Capitalize";

export const alertSuccess = (object: UserApi) => {
  const info = `
    Nombre: ${Capitalize(object.name)},
    Legajo: ${object.docket},
    Registro: ${object.date}
  `;

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Validado!',
    text: info,
    showConfirmButton: false,
    timer: 5500
  })
}

export const alertError = (error: string) => {
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Error en la validacion...',
    text: error,
    showConfirmButton: false,
    timer: 5500
  })
}

