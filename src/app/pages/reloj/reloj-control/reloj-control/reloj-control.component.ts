import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CargoDTO } from 'src/app/shared/model/database-dto/cargoDTO';
import { EmpresaDTO } from 'src/app/shared/model/database-dto/empresaDTO';
import { PlanillaDetalleDTO } from 'src/app/shared/model/database-dto/planillaDetalleDTO';
import { PlanillaDTO } from 'src/app/shared/model/database-dto/planillaDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/shared/model/database-entities/persona';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import { UtilTools } from 'src/app/shared/util/util-tools';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseDTO } from 'src/app/shared/model/responseDTO';


@Component({
  selector: 'app-reloj-control',
  templateUrl: './reloj-control.component.html',
  styleUrls: ['./reloj-control.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class RelojControlComponent implements OnInit {

  columnsPlanilla: string[] = ['dni', 'date', 'message'];

  public state = '';

  file: File;
  showTable: boolean = false;
  outputRelojC : any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private construtechService: ConstrutechService,
    private router: Router,
    private utils: UtilTools,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

	onDragOver(event: DragEvent) {
		event.preventDefault();
    //this.file = (event.target as HTMLInputElement).files[0];
	}

  onDrop(event: DragEvent) {
		event.preventDefault();
    this.file = event.dataTransfer.files[0]
    console.log(this.file)
    // this.file = (event.target as HTMLInputElement).files[0];

  }

  onFileSelected(event: Event) {
    event.preventDefault();  
    this.file = (event.target as HTMLInputElement).files[0];
  }

  uploadFile(): void {
    this.spinner.show();
    this.construtechService.envioExcel(this.file)
      .subscribe(
        (response: any) => {
          console.log(response)
          this.showTable = true;
          this.outputRelojC = response;
          console.log(this.outputRelojC)
          if (response) {
            this.utils.CloseTimer()
            Swal.fire({
              type: "success",
              title: "Importación realizada correctamente",
              html: response.mensaje,
              confirmButtonColor: this.translate.instant("alert.alert_button_color")
            });
            const fileInput = document.getElementById('inputGroupFile01') as HTMLInputElement;
            fileInput.value = '';
          }
          this.spinner.hide();
        },
        (error) => {
          Swal.fire({
            type: "error",
            title: "Importación no realizada",
            html: error.mensaje,
            confirmButtonColor: this.translate.instant("alert.alert_button_color")
          });
          console.log(error)
          this.spinner.hide();
        }
      );
  }
    
    // this.construtechService.envioExcel(this.file).subscribe(
    //   res=>{
    //     console.log(res)
    //     if (res.codigo === 1000) {
    //       this.utils.CloseTimer()
    //       Swal.fire({
    //         type: "success",
    //         title: "Nueva Dotacion",
    //         html: res.mensaje,
    //         confirmButtonColor: this.translate.instant("alert.alert_button_color")
    //       });
    //     } else {
    //       Swal.fire({
    //         type: "info",
    //         title: "Nueva Dotacion",
    //         html: res.mensaje,
    //         confirmButtonColor: this.translate.instant("alert.alert_button_color")
    //       });
    //     }
    //   },
    //   err => {
    //     console.log(err)
    //     Swal.fire({
    //       type: "error",
    //       title: "Nueva Dotacion",
    //       html: err.mensaje,
    //       confirmButtonColor: this.translate.instant("alert.alert_button_color")
    //     });
    //   }
    // )
  }

  

