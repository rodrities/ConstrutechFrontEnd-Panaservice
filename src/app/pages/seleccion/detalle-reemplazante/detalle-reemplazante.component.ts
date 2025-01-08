import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import dep from 'src/assets/json/departamentos.json'

@Component({
  selector: 'app-detalle-reemplazante',
  templateUrl: './detalle-reemplazante.component.html',
  styleUrls: ['./detalle-reemplazante.component.css']
})
export class DetalleReemplazanteComponent implements OnInit {

  operacion: string[] = ['BATEAS', 'CDA', 'CORI PUNO'];
  servicio: string[] = ['ALIMENTACION', 'HOTELERIA'];
  RNS: string[] = ['R'];
  motivo: string[] = ['RENUNCIA VOLUNTARIA', 'NUEVO SERVICIO / PUESTO', 'ABANDONO DE TRABAJO', 'NO RENOVACIÓN'];
  estado: string[] = ['CONVOCATORIA', 'EN INCORPORACION', 'ENTREVISTA POR CLIENTE', 'VALIDACIÓN', 'REQUERIMIENTO SUSPENDIDO'];
  proceso: string[] = ['ACTIVO', 'PENDIENTE', 'CERRADO']
  departamentos: any[] = [];
  
  persona_AT : any = {}
  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private datePipe: DatePipe
  ) { 
    this.departamentos = dep;
    this.persona_AT = inputData

    this.formatSueldo(this.persona_AT.techAtracSalBas)
    console.log(this.persona_AT)

  }

  ngOnInit(): void {
  }


  formatSueldo(sueldo: number) {
    let formattedNumber = sueldo.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }).replace(/\s/g, '');
    this.persona_AT.techAtracSalBas = formattedNumber
  }

  formatCeseDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || 'Sin Información';
  }
}
