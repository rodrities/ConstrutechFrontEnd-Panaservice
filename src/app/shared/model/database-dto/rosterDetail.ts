import { RusterDTO } from "./rusterDTO";
import { UnidadDTO } from "./unidadDTO";

export interface RosterDetail {
    proyecto: UnidadDTO;
    roster:   RusterDTO[];
}

