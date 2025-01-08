import { ConceptoPagoDTO } from "../model/lista-dto/conceptoPagoDTO";
import { TipoContratoDTO } from "../model/lista-dto/tipoContratoDTO";
import { ZonaDTO } from "../model/lista-dto/zonaDTO";

export const TIPO_CONTRATOS: TipoContratoDTO[] = [
    {
        id: 1,
        descripcion: "CONTRACTUAL"
    },
    {
        id: 2,
        descripcion: "REFACTURADO"
    },
    {
        id: 3,
        descripcion: "AYEPSA"
    }
]

export const ZONAS: ZonaDTO[] = [
    {
        id: 1,
        descripcion: "SUPERFICIE"
    },
    {
        id: 2,
        descripcion: "INT.MINA"
    },
]

export const CONCEPTO_PAGOS: ConceptoPagoDTO[] = [
    {
        id: 1,
        descripcion: "Sueldo Básico"
    },
    {
        id: 13,
        descripcion: "Asignación Familiar"
    },
    {
        id: 121,
        descripcion: "Ind. Hora Extra 25%"
    },
    {
        id: 122,
        descripcion: "Ind. Hora Extra 35%"
    },
    {
        id: 41,
        descripcion: "Asignación por Movilidad"
    },
    {
        id: 120,
        descripcion: "Provisión de Alimentación"
    }
]