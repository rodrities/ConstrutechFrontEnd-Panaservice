import { PagoDetalleDTO } from "./pagoDetalleDTO"

export class DotacionDetalleDTO {
    cant: number
    //mont: number
    planId: number
    planDes: string
    ugesId: number
    ugesDes: string
    tctoId: number
    tctoDes: string
    ccosId: number
    ccosDes: string
    zonId: number
    zonDes: string
    cargId: number
    cargDes: string

    montMovProv: number
    montEfect: number
    montTotCncp: number
    montTotMov: number
    montTotProv: number

    pagoDetalles: PagoDetalleDTO[]
}