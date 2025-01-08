import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDateRangeSelectionStrategy, DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ProgramacionDTO } from 'src/app/shared/model/database-dto/programacionDTO';
import { differenceInDays, format } from 'date-fns';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { da } from 'date-fns/locale';


interface EstadoLaboral{
  nombre: string;
  value: string;
  id: number;
}
// @Injectable()
// export class SeleccionSemanalCalendario<D> implements MatDateRangeSelectionStrategy<D> {
//   constructor(private _dateAdapter: DateAdapter<D>) {}

//   selectionFinished(date: any | null): DateRange<any> {
//     return this.seleccionarSemana(date);
//   }

//   createPreview(activeDate: any | null): DateRange<any> {
//     return this.seleccionarSemana(activeDate);
//   }

//   private seleccionarSemana(date: any | null): DateRange<any> {
//     if (date) {
//       const start = this._dateAdapter.addCalendarDays(date, 0);
//       const end = this._dateAdapter.addCalendarDays(date, 7);
//       return new DateRange<any>(start, end);
//     }

//     return new DateRange<any>(null, null);
//   }
// }

@Component({
  selector: 'app-fechalaboralpop',
  templateUrl: './fechalaboralpop.component.html',
  styleUrls: ['./fechalaboralpop.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FechalaboralpopComponent{

  calendarioPrimerDia: DateRange<Date> | null; 
  calendarioUltimoDia:Date | null;

  fechaMin: Date | null;
  dateFechaLimite: Date | null;
  fechaMax: Date | null;
  programacionPrevia = [];

  pperPdepId: number;

  fechaPrimerDia: any = '';
  fechaUltimoDia: any = '';
  semanaLaboralGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FechalaboralpopComponent>,
    private translate: TranslateService, 
    private _dateAdapter: DateAdapter<any>, 
    private datePipe: DatePipe
  ) { }

  
  listEstadosLaborales: EstadoLaboral[] = [
    {nombre: "NO DEFINIDO", value: "ND", id: 19},
    {nombre: "DIAS TRABAJADOS", value: "T", id: 1},
    {nombre: "DESCANSO LABORAL", value: "DL", id: 2},
    {nombre: "VACACIONES", value: "V", id: 3},
    {nombre: "FALTA", value: "F", id: 7},
    {nombre: "FERIADOS TRABAJADOS", value: "FT", id: 6},
    {nombre: "LICENCIA CON GOCE HABER", value: "LCG", id: 4},
    {nombre: "LICENCIA SIN GOCE HABER", value: "LSG", id: 8},
    {nombre: "DESCANSO MEDICO", value: "DM", id: 5},
    {nombre: "ACCIDENTE DE TRABAJO", value: "AT", id: 9},
    {nombre: "DESCANSO POST NATAL", value: "DPN", id: 10},
    {nombre: "DESCANSO PRE NATAL", value: "DPRN", id: 11},
    {nombre: "DESCANSO POR PATERNIDAD", value: "LPP", id: 12},
    {nombre: "PERIODO DE PRUEBA", value: "PP", id: 15},
    {nombre: "LICENCIA POR FALLECIMIENTO", value: "LPF", id: 13},
    {nombre: "SUSPENSIÓN POR RAZONES DE CONDUCTA", value: "SRC", id: 14},
    {nombre: "DESPIDO", value: "D", id: 16},
    {nombre: "RENUNCIA VOLUNTARIA", value: "R", id: 17},
    {nombre: "TÉRMINO DE CONTRATO", value: "TC",id:18},
  ]
  
  ngOnInit() {
    /*console.log(this.data);
    if(this.data != null || this.data != undefined){
      this.fechaMin = this.data.inicio.toDate();
      this.fechaMax = this.data.final.toDate();
    }*/
    this.fechaMin = new Date();

    this.semanaLaboralGroup = this.formBuilder.group({
      start: new FormControl(),
      end: new FormControl(),
      estadoLaboral: new FormControl()
    })

    
    if(this.data != null || this.data != undefined){
      console.log(this.data.fechaEnviada)
      console.log(this.data.fechaLimite)

      const [day, month, year] = this.data.fechaEnviada.split('-').map(Number);
      const [dayLimite, monthLimite, yearLimite] = this.data.fechaLimite.split('-').map(Number);

      const date = new Date(year, month - 1, day);
      const date2 = new Date(year, month - 1, day + 13); //SE SUMA 13 PORQUE AL CONTAR LA FECHA SELECCIONADA DAN 14 DIAS
      const limitDate = new Date(yearLimite, monthLimite - 1, dayLimite)

      //console.log(date)
      //console.log(date2)

      this.dateFechaLimite  = limitDate;
      this.pperPdepId = this.data.trabajador.persPlanillaDetalleId
      const fechaDate2 = new Date(date2);

      let timeFechaLimite = this.dateFechaLimite.getTime();
      let timeFechaDate2 = fechaDate2.getTime();

      if (timeFechaLimite < timeFechaDate2) {
        this.semanaLaboralGroup.controls['end'].setValue(this.dateFechaLimite)
      } else {
        this.semanaLaboralGroup.controls['end'].setValue(date2)
      }

      
      this.semanaLaboralGroup.controls['start'].setValue(date)

      this.programacionPrevia = this.data.trabajador.programacion;
      console.log(this.data.trabajador);
      console.log(this.programacionPrevia);
    }
  }

  close(data?: any): void {

    if (data === 1) {
      let programacion : ProgramacionDTO[] = [];
      let progra : ProgramacionDTO;
  
      const fechaActual = new Date(this.semanaLaboralGroup.controls['start'].value)
      let differenceDays = differenceInDays(new Date(this.semanaLaboralGroup.controls['end'].value), fechaActual)
  
      for (let i = -1; i < differenceDays; i++) {
        progra = new ProgramacionDTO()
        progra.id = null
        progra.diaLaboral = format(fechaActual, "dd-MM-yyyy")
        progra.estadoLaboral = this.semanaLaboralGroup.controls['estadoLaboral'].value
        progra.pperProeId = this.listEstadosLaborales.find(item => item.value === this.semanaLaboralGroup.controls['estadoLaboral'].value).id;
        progra.pperPdepId = this.pperPdepId
        console.log(progra)
        programacion.push(progra)
        console.log(programacion)
        fechaActual.setDate(fechaActual.getDate() + 1); // Añadir un día
      }
  
      this.dialogRef.close({data: programacion}); 
    } else {
      this.dialogRef.close()
    }
  }

  transformarFormatoFechas(){
    this.fechaPrimerDia = this.datePipe.transform(this.semanaLaboralGroup.controls['start'].value, 'yyyy-MM-dd');
    this.fechaUltimoDia = this.datePipe.transform(this.semanaLaboralGroup.controls['end'].value, 'yyyy-MM-dd');
  }

  guardar(){
    this.close(1);
    this.transformarFormatoFechas();
    console.log(this.fechaPrimerDia);
    console.log(this.fechaUltimoDia);
  }
  
}


