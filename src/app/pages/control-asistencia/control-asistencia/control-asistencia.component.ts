import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardComponent } from 'src/app/core/components/dashboard/dashboard.component';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-asistencia',
  templateUrl: './control-asistencia.component.html',
  styleUrls: ['./control-asistencia.component.css']
})
export class ControlAsistenciaComponent implements OnInit {
  @ViewChild('scanner') scanner: ZXingScannerComponent;

  showTable: boolean;

  outputRelojC: any = {}

  columnsPlanilla: any[] = []

  torchEnabled: boolean = false;
  scanningEnabled: boolean = true;
  scannedData: string = '';
  dniShow: string = ''

  currentDate: String;

  constructor(
    private construtechService: ConstrutechService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    const dateObj = new Date();

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    this.currentDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
  }

  openModal(){
    this.dialog.open(DashboardComponent, {
      width: '120%',
      height: '95vh',
      data : 'marcaciones'
    });
  }

  public getCurrentDate(): Date {
    return new Date();
  }

  onScanSuccess(result: string) {
    this.scanningEnabled = false
    this.scannedData = result;
    console.log(this.scannedData)
    let dni = result.split('/').shift();
    let date = result.split('/').pop();
    this.dniShow = dni;

    if (this.validateDate(date)) {
      this.save(dni);
    } else {
      Swal.fire({
        type: "error",
        title: "Código QR desactualizado ",
        text: "",
      }).then((result) => {
        this.scanningEnabled = true
        this.dniShow = null;
        this.scannedData = null;
      })
    }
  }

  validateDate(date: string): boolean {
    if (this.currentDate === date) {
      return true;
    } else {
      return false;
    }
  }

  toggleScanning() {
    this.scanningEnabled = !this.scanningEnabled;
  }

  save(dni: any) {
    let valor = Number(sessionStorage.getItem('usuarioid'));
    this.spinner.show();
    let filtro = new FiltroDTO();
    filtro.filteruserId = valor;
    filtro.filterPerDoc = dni;
    this.construtechService.saveAsistencia(filtro).subscribe(
      (res) => {
        console.log(res)
        this.spinner.hide();
        if(res.codigo === 1034){
          Swal.fire({
            type: "info",
            title: "EL USUARIO NO TIENE UNA PLANILLA ASIGNADA ",
          }).then((result) => {
            this.scanningEnabled = true
            this.scannedData = null;
            this.dniShow = null;
          })
        }else{
          Swal.fire({
            type: "success",
            title: "Registro realizado",
            html: "<strong>Dni:</strong> " + dni + "<br><strong>Persona:</strong> " + res.nombreCom,
          }).then((result) => {
            this.scanningEnabled = true
            this.scannedData = null;
            this.dniShow = null;
          })
        }
        
      },
      (error) => {
        console.log(error)
        this.spinner.hide();
        Swal.fire({
          type: "error",
          title: "Registro no realizado",
          text: "",
          timer: 3000
        }).then((result) => {
          this.scanningEnabled = true;
          this.scannedData = null;
          this.dniShow = null;
        })
      }
    )
  }


}
