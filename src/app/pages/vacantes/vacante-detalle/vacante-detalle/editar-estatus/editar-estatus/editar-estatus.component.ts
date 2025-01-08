import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { VacanteDetalleDTO } from 'src/app/shared/model/database-dto/vacanteDetalleDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';

@Component({
  selector: 'app-editar-estatus',
  templateUrl: './editar-estatus.component.html',
  styleUrls: ['./editar-estatus.component.css']
})
export class EditarEstatusComponent implements OnInit {

  resultados = [
    "Seleccionado", "No contactado", "No interesado", "No Califica", "Pendiente Entrevista", "No Se Presentó"
  ]

  estatus = [
    "No Califica", "Desistió", "Pre seleccionado", "Base de datos", "Incorporación", "Black list"
  ]

  date: any
  date2: any
  reAtrac: string;
  reTecnica: string;
  estatusFinal: string;
  vacanteDet = new VacanteDetalleDTO()
  semanaLaboralGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number,
  private datePipe: DatePipe,
  private formBuilder: FormBuilder,
  private service: ConstrutechService,
  private router: Router,
  public dialogRef: MatDialogRef<EditarEstatusComponent>) { }

  date1Change = false
  date2Change = false

  ngOnInit(): void {
    console.log(this.data)

    this.semanaLaboralGroup = this.formBuilder.group({
      date: new FormControl(),
      date2: new FormControl(),
      estadoLaboral: new FormControl()
    })
  }


  guardar() {
    this.vacanteDet.vacdId = this.data

    console.log(this.date)
    console.log(this.date2)

    if (this.date != undefined && this.date != null)
      this.vacanteDet.vacdFeEvaInterna = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    if (this.date2 != undefined && this.date2 != null)
      this.vacanteDet.vacdFeEvaTecnica = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    
    console.log(this.vacanteDet)

    this.service.editVacanteDetalle(this.vacanteDet).subscribe(
      res => {
        this.dialogRef.close()
        window.location.reload();
      }
    )

  }

}
