import { Cargo } from "../database-entities/cargo"

export class RolDTO {
    cargo: string = ""
    dia: string = ""
    mensaje: string = "El cargo " + this.cargo + " no cumple con la relacion de trabajo estipulada el dia " + this.dia
}