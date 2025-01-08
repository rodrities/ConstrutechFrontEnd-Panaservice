export class ProgramacionDTO {
    id: number = 0
    diaLaboral: string = ''
    estadoLaboral: string = ''

    //OBJETO DE GUARDADO DE PROGRAMACION DE PERSONAL
    pperId = this.id;
    pperPdepId: number;
    pperFecha = this.diaLaboral;
	pperProeId: number;

    //formato de dia
    diaLaboralFormat: string
}