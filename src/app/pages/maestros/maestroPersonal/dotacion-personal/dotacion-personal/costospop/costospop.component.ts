import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { UtilTools } from 'src/app/shared/util/util-tools';
import { ConsolidadopopComponent } from '../../../crear-dotacion/consolidadopop/consolidadopop.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-costospop',
  templateUrl: './costospop.component.html',
  styleUrls: ['./costospop.component.css']
})
export class CostospopComponent implements OnInit {

  //Costos
  costos = [];
  columnsCostos: string[] = ['position', 'conceptoCosto', 'monto']
  costoDataSource = new MatTableDataSource<any>();
  dataCosto: boolean = false;
  //Detalle de Costos
  detalleCostos = [];
  columnsDetalleCostos: string[] = ['position', 'conceptoCosto', 'monto']
  dataDetalleCosto: boolean = false;
  detalleCostoDataSource = new MatTableDataSource<any>();


  constructor(private utils: UtilTools,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsolidadopopComponent>,
    private translate: TranslateService,
    private construtechService: ConstrutechService,
    private router: Router) { }

  ngOnInit(){
    
    if(this.data != null || this.data != undefined){
      this.costos = this.data.costos;
      this.detalleCostos = this.data.detalleCostos;

      this.costoDataSource = new MatTableDataSource(this.costos);
      this.detalleCostoDataSource = new MatTableDataSource(this.detalleCostos);

      console.log(JSON.stringify(this.costos))
      console.log(JSON.stringify(this.detalleCostos))

    }
  }

  close(data?: any){
    this.dialogRef.close()
  }

}
