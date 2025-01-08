import { DotacionDetalleDTO } from "./dotacionDetalleDTO"

export class DotacionDTO {
    cod: string
    motivo: string
    empId: number
    uproId: number
    dotacionDetalles: DotacionDetalleDTO[]

    id: number
    perfil: string
    aproId: string
    estId: number
}