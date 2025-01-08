import { ProgramacionDTO } from "./programacionDTO";

export class PersonalDTO {
    persId: number
    persTdocDesc: string
    persNuDoc: string
    persNombreComp: string

    //PARA RUSTER
    programacion: ProgramacionDTO[] = [];

    //PdepId del Personal
    persPlanillaDetalleId: number;
}