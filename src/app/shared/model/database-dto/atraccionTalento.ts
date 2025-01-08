export class AtraccionTalentoDTO {
    techAtracId: number;
    techAtracPlandpId: number;
    techAtracPlandId: number;
    techAtracApellidosp: string;
    techAtracNombresp: string;
    techAtracDni: string;
    techAtracProcedencia: string;
    techAtracFuenteRecl: string;
    techAtracSalBas: string;
    techAtracProceso: string;
    techAtracFechaIng: Date;
    techAtracFechaSel: Date;
    techAtracFechaIdealIng: Date;
    techAtracEmo: string;
    techAtracEmoDate: Date;
    techAtracInduccion: string;
    techAtracInduccionDate: Date;
    techAtracObservaciones: string;
    techAtracFechaReq: Date;
    techAtracEstadoProceso: string;
    techAtracMotivoContr: string;
    techAtracTFechRegis: Date;
    techAtracResponsableRys: string;
    techAtracJefeO: string;
    techAtracOperacion: string;
    techAtracRns: string;
    techAtracServicio: string;
    techAtracEmoArch: File;
    techAtracInduccionArch: File;
  
    constructor(data?: Partial<AtraccionTalentoDTO>) {
      Object.assign(this, data);
    }
  }