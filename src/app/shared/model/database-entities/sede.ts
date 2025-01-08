import { CondicionSede } from "./condicionSede"
import { TipoSede } from "./tipoSede"

export class Sede {
    sedeId: number
    sedeNombre: string
    sedeFeCrea: string
    sedeUsuCreaId: number

    tipoSede: TipoSede
    condicionSede: CondicionSede

}