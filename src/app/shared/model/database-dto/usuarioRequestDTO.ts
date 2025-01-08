import { planillaUsuario } from "../database-entities/planillaUsuarios"
import { PlanillaDetalleDTO } from "./planillaDetalleDTO"

export class UsuarioRequestDTO {
    usuId: number
    usuPerId: number
    usuEmpId: number
    usuClave: string
    usuCorreo: string
    usupPerfId: number
    crearPersona: boolean
    perTdocId: number
    perNombres: string
    perApellidoPat: string
    perApellidoMat: string
    perNuTelefono: string
    perNuDoc: string
    perCorreo : string
    usuEstId: number
    usuAplId: number
    planillaDetalle: planillaUsuario[]
}