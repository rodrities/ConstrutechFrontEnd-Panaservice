import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { DotacionDTO } from 'src/app/shared/model/database-dto/dotacionDTO';
import { DotacionDetalleDTO } from 'src/app/shared/model/database-dto/dotacionDetalleDTO';
import { EmpresaDTO } from 'src/app/shared/model/database-dto/empresaDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import Swal from 'sweetalert2';
import { ConsolidadopopComponent } from '../consolidadopop/consolidadopop.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilTools } from 'src/app/shared/util/util-tools';
import moment from 'moment';

@Component({
  selector: 'app-crear-dotacion',
  templateUrl: './crear-dotacion.component.html',
  styleUrls: ['./crear-dotacion.component.css']
})
export class CrearDotacionComponent implements OnInit {

  filtro: FiltroDTO;
  filtroMasterPersonal: FormGroup;
  filteredObjetos: EmpresaDTO[] = [];
  filteredObjetos2: UnidadDTO[] = [];

  //Nueva Dotacion
  filtroNuevaDotacion: FormGroup;
  columnsNuevaDotacion: string[] = ['position', 'planilla', 'ugestion', 'tipoContrato', 'centroCosto', 'zona', 'cargo', 'cantidad', 'movil', 'efectivo', 'concepto', 'eliminar'];
  nuevaDotacionDataSource = new MatTableDataSource<any>();
  empresas = [];
  listaUnidadProyectos: UnidadDTO[]
  listaEmpresas: EmpresaDTO[]
  nuevaDotacion: DotacionDetalleDTO[] = []

  constructor(
    private formBuilder: FormBuilder,
    private construtechService: ConstrutechService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private utils: UtilTools,
  ) { }

  ngOnInit(): void {
    this.filtroMasterPersonal = this.formBuilder.group({
      uproyecto: new FormControl(-1),
      empresa: new FormControl(-1),
    })

    this.filtroNuevaDotacion = this.formBuilder.group({
      uproyecto: new FormControl(-1),
      empresa: new FormControl(-1),
      personas: new FormControl({ value: 0, disabled: true }),
    });

    this.getEmpresas();
    this.getUproyecto();
  }

  public getUproyecto2() {
    this.filtro = new FiltroDTO()
    this.filtro.filterEmpId = this.filtroNuevaDotacion.controls['empresa'].value

    this.construtechService.getUproyectoV2("", this.filtro)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.listaUnidadProyectos = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  addConsolidado() {
    let empresaId = this.filtroNuevaDotacion.controls['empresa'].value
    let uproyectoId = this.filtroNuevaDotacion.controls['uproyecto'].value
    if (empresaId === -1) {
      this.alert(
        'info',
        'Dotacion Personal',
        'Debe seleccionar la empresa para la cual desea crear una nueva dotacion de personal');
    } else {
      let dialogRef = this.dialog.open(ConsolidadopopComponent, {
        height: "fit-content",
        autoFocus: false,
        disableClose: true,
        data: { empresaId: empresaId, uproyectoId: uproyectoId  },
      });

      dialogRef.afterClosed().subscribe(res => {
        console.log('dialogRef.afterClosed()', res);

        if (res !== null && res !== undefined) {

          this.filtroNuevaDotacion.controls['empresa'].disable()
          this.filtroNuevaDotacion.controls['uproyecto'].disable()

          let cantidadPersonas = this.filtroNuevaDotacion.controls['personas'].value
          this.filtroNuevaDotacion.controls['personas'].setValue(cantidadPersonas + res.cant)

          this.nuevaDotacion.push(res)
          this.nuevaDotacionDataSource = new MatTableDataSource(this.nuevaDotacion)
        }
      })
    }
  }

  modificarNuevaDotacion(element: DotacionDetalleDTO, i: number) {
    let empresaId = this.filtroNuevaDotacion.controls['empresa'].value
    let dialogRef = this.dialog.open(ConsolidadopopComponent, {
      height: "fit-content",
      autoFocus: false,
      disableClose: true,
      data: { empresaId: empresaId, dotacionDetalleOld: element }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res !== null || res !== undefined) {
        let cantidadPersonas = this.filtroNuevaDotacion.controls['personas'].value
        this.filtroNuevaDotacion.controls['personas'].setValue(cantidadPersonas + res.cant - element.cant)

        this.nuevaDotacion[i] = res

        this.nuevaDotacionDataSource = new MatTableDataSource(this.nuevaDotacion)
      }
    })
  }

  eliminarNuevaDotacion(element: DotacionDetalleDTO, i: number) {
    let cantidadPersonas = this.filtroNuevaDotacion.controls['personas'].value
    this.filtroNuevaDotacion.controls['personas'].setValue(cantidadPersonas - element.cant)

    this.nuevaDotacion.splice(i, 1)

    if (this.nuevaDotacion.length >= 1) {
      this.nuevaDotacionDataSource = new MatTableDataSource(this.nuevaDotacion)
    } else {
      this.nuevaDotacionDataSource = new MatTableDataSource<any>();
      this.filtroNuevaDotacion.controls['empresa'].enable()
      this.filtroNuevaDotacion.controls['uproyecto'].enable()
    }
  }

  public guardarNuevaDotacion() {
    let dotacionDTO: DotacionDTO = new DotacionDTO()
    dotacionDTO.cod = this.filtroNuevaDotacion.controls['empresa'].value + '-' + this.filtroNuevaDotacion.controls['uproyecto'].value + '-00' + (moment(new Date())).format('YYYYMMDD')
    dotacionDTO.empId = this.filtroNuevaDotacion.controls['empresa'].value
    dotacionDTO.motivo = "Solicitud Inicial"
    dotacionDTO.uproId = this.filtroNuevaDotacion.controls['uproyecto'].value
    dotacionDTO.dotacionDetalles = this.nuevaDotacion

    console.log(JSON.stringify(dotacionDTO))

    Swal.fire({
      type: "info",
      title: "Guardar Nueva Dotacion",
      text: "¿Está seguro de guardar los cambios realizados?",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Si, estoy seguro",
      cancelButtonText: "No, voy a verificar",
      confirmButtonColor: this.translate.instant('alert.alert_button_color'),
      cancelButtonColor: this.translate.instant('alert.alert_button_color'),
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: (x) => {
      }
    }).then(
      response => {
        if (response.value) {

          this.construtechService.saveDotacion(dotacionDTO).subscribe(
            res => {
              if (res.codigo === 1000) {
                this.utils.CloseTimer()
                Swal.fire({
                  type: "success",
                  title: "Nueva Dotacion",
                  html: res.mensaje,
                  confirmButtonColor: this.translate.instant("alert.alert_button_color")
                });
              } else {
                Swal.fire({
                  type: "info",
                  title: "Nueva Dotacion",
                  html: res.mensaje,
                  confirmButtonColor: this.translate.instant("alert.alert_button_color")
                });
              }
            },
            err => {
              Swal.fire({
                type: "error",
                title: "Nueva Dotacion",
                html: err.mensaje,
                confirmButtonColor: this.translate.instant("alert.alert_button_color")
              });
            }
          )
        }
      }
    )
  }

  public alert(type: any, title: any, error: string) {
    Swal.fire({
      type: type,
      title: title,
      html: error,
      confirmButtonColor: this.translate.instant("alert.alert_button_color")
    });
  }

  public getEmpresas() {
    this.construtechService.getEmpresas()
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.empresas = res.data
            this.filteredObjetos = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  public getUproyecto() {
    this.filtro = new FiltroDTO()
    this.filtro.filterEmpId = this.filtroMasterPersonal.controls['empresa'].value
    
    this.construtechService.getUproyectoV2("", this.filtro)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.listaUnidadProyectos = res.data
            this.filteredObjetos2 = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }
}
