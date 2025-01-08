import { TipoDocumento } from "../database-dto/tipoDocumento"
import { Cargo } from "./cargo"
import { CargoTipo } from "./cargoTipo"
import { Categoria } from "./categoria"
import { EstadoCivil } from "./estadoCivil"
import { Horario } from "./horario"
import { Sede } from "./sede"
import { TipoNivelEducativo } from "./tipoNivelEducativo"
import { TipoPersonal } from "./tipoPersonal"
import { TipoProfesion } from "./tipoProfesion"
import { TipoTrabajador } from "./tipoTrabajador"

export class Persona {
    perId: number
    perNuDoc: string
    perNombres: string
    perApePaterno: string
    perApeMaterno: string
    perNomCompleto: string
    perNuTelefono: string
    perCorreo: string
    perDireccion: string
    perFeCrea: string
    perUsuCreaId: number
    perFeMod: string
    perUsuModId: number
    perEstId: number
    perSexo: string
    perFeNacimiento: string
    perUbigeo: string
    perFeIngreso: string
    perFeCese: string
    perDiscapacitado: string
    perDepartamento: string
    perProvincia: string
    perDistrito: string

    //Objetos
    tipoDocumento: TipoDocumento
    estadoCivil: EstadoCivil
    tipoProfesion: TipoProfesion
    sede: Sede
    cargo: Cargo
    cargoTipo: CargoTipo
    tipoPersonal: TipoPersonal
    tipoTrabajador: TipoTrabajador
    horario: Horario
    tipoNivelEducativo: TipoNivelEducativo
    categoria: Categoria


}