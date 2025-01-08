import { ProgramacionDTO } from "./database-dto/programacionDTO";
import { RusterDTO } from "./database-dto/rusterDTO";

export class FiltroDTO {
    pageNumber: number;
    pageSize: number;

    filterEmpId: number;
    filterPlanId: number
    filterAgno: number
    filterMes: number
    filterUproId: number
    filterUgesId: number
    filterCcosId: number
    filterCargId: number
    filterPerDoc: string

    filterPdetId: number

    filterFecIni: string
    filterFecFin: string
    filterProyId: number;


    filterProgramacion: ProgramacionDTO[]
    filterRuster: RusterDTO[]
    filterIds: number[]
    filterZonId: number;
    filterTctoId: number;
    filteruserId: number;

    filterDotId: number;

    filterplanDesc: string;
    filteruProyDesc: string;

    filterCpddConpId: number
    filterDdetUgesId: number
    filterDdetCargId: number
    filterDdetPlanId: number

    filterUsuId: number

    filterUproIdArray: number[];

    filterVacanteId: number;
}

