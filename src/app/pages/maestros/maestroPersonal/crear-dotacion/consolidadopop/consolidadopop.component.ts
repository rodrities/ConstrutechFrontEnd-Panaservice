import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CargoDTO } from 'src/app/shared/model/database-dto/cargoDTO';
import { DotacionDetalleDTO } from 'src/app/shared/model/database-dto/dotacionDetalleDTO';
import { PagoDetalleDTO } from 'src/app/shared/model/database-dto/pagoDetalleDTO';
import { PlanillaDTO } from 'src/app/shared/model/database-dto/planillaDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ConceptoPagoDTO } from 'src/app/shared/model/lista-dto/conceptoPagoDTO';
import { TipoContratoDTO } from 'src/app/shared/model/lista-dto/tipoContratoDTO';
import { ZonaDTO } from 'src/app/shared/model/lista-dto/zonaDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consolidadopop',
  templateUrl: './consolidadopop.component.html',
  styleUrls: ['./consolidadopop.component.css']
})

export class ConsolidadopopComponent implements OnInit {

  listPlanilla: PlanillaDTO[]
  listUnidadGestion: UnidadDTO[]
  listCentroCostos: UnidadDTO[]
  listTipoContrato: TipoContratoDTO[]
  listZonas: ZonaDTO[]
  listCargos: CargoDTO[]
  listConceptoCostos: ConceptoPagoDTO[]

  nuevoConsolidadoGroup: FormGroup;
  detalleCostosGroup: FormGroup;

  columnsDetalleCostos: string[] = ['position', 'conceptoCosto', 'monto', 'eliminar']

  dataDetalleCosto: boolean = false;
  detalleCostoDataSource = new MatTableDataSource<any>();
  empresaId: number;

  pagoDetalles: PagoDetalleDTO[] = [];
  pagoDetalle: PagoDetalleDTO;

  dotacionDetalle: DotacionDetalleDTO;
  
  totalMovilidad: number = 0
  totalProvisiones: number = 0
  totalMovProv: number = 0
  totalEfectivo: number = 0
  totalConceptos: number = 0
  
  sctrSuperficie: number = 0.011
  sctrSocavon: number = 0.045
  vidaLey: number = 0.0064
  esSalud: number = 0.09

  filtro: FiltroDTO;

  ErrorMontoHistorico = false;

  filteredObjetosUgestion: UnidadDTO[] = [];
  searchTermUgestion: string = '';
  selectedUnidId = -1;

  filteredObjetosCCostos: UnidadDTO[] = [];
  searchTermCCostos: string = '';
  selectedCCostosId = -1;

  filteredObjetosCargos: CargoDTO[] = [];
  searchTermCargos: string = '';
  selectedCargosId = -1;

  empresaFilter:number = -1;
  unidadProyectoFilter: number = -1;
  planillaFilter: number = -1;
  ugestionFilter: number = -1;
  busquedaFilter: FiltroDTO;

  ugestionAux: string

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsolidadopopComponent>,
    private translate: TranslateService,
    private construtechService: ConstrutechService
  ) { }

  ngOnInit() {

    this.nuevoConsolidadoGroup = this.formBuilder.group({
      planilla: new FormControl(''),
      ugestion: new FormControl(''),
      tipoContrato: new FormControl(''),
      centroCostos: new FormControl(''),
      zona: new FormControl(''),
      cargo: new FormControl(''),
      cantidad: new FormControl(''),
    })

    this.detalleCostosGroup = this.formBuilder.group({
      conceptoCosto: new FormControl(1, [Validators.required]),
      monto: new FormControl('', [Validators.required]),
    })

    if (this.data != null || this.data != undefined) {

      // console.log(this.data)

      if (this.data.empresaId != null || this.data.empresaId != undefined) {
        this.empresaId = this.data.empresaId;
      }
    }

    this.empresaFilter = this.data.empresaId
    this.unidadProyectoFilter = this.data.uproyectoId

    this.getPlanillas()
    this.getUgestionV2()
    this.getCcostosV2()
    this.getCargosV3()
    this.listZonas = this.construtechService.getZonas()
    this.listTipoContrato = this.construtechService.getTipoContratos()
    this.listConceptoCostos = this.construtechService.getConceptoPagos()

    this.construtechService
      .getConceptoPagos()
      .forEach((conceptoCosto) => {
        let pagoDetalle: PagoDetalleDTO = new PagoDetalleDTO()
        pagoDetalle.cpId = conceptoCosto.id;
        pagoDetalle.cpDes = conceptoCosto.descripcion;
        pagoDetalle.mont = 0;
        pagoDetalle.checked = true;

        this.agregarDetalleTabla(pagoDetalle);
      })


    if (this.data != null || this.data != undefined) {
      // console.log("hola" + this.data.dotacionDetalleOld)
      if (this.data.dotacionDetalleOld != null || this.data.dotacionDetalleOld != undefined) {
        this.nuevoConsolidadoGroup.controls['cantidad'].setValue(this.data.dotacionDetalleOld.cant)
        this.nuevoConsolidadoGroup.controls['planilla'].setValue(this.data.dotacionDetalleOld.planId + "," + this.data.dotacionDetalleOld.planDes)
        this.nuevoConsolidadoGroup.controls['ugestion'].setValue(this.data.dotacionDetalleOld.ugesId + "," + this.data.dotacionDetalleOld.ugesDes)
        this.nuevoConsolidadoGroup.controls['tipoContrato'].setValue(this.data.dotacionDetalleOld.tctoId + "," + this.data.dotacionDetalleOld.tctoDes)
        this.nuevoConsolidadoGroup.controls['centroCostos'].setValue(this.data.dotacionDetalleOld.ccosId + "," + this.data.dotacionDetalleOld.ccosDes)
        this.nuevoConsolidadoGroup.controls['zona'].setValue(this.data.dotacionDetalleOld.zonId + "," + this.data.dotacionDetalleOld.zonDes)
        this.nuevoConsolidadoGroup.controls['cargo'].setValue(this.data.dotacionDetalleOld.cargId + "," + this.data.dotacionDetalleOld.cargDes)
        this.data.dotacionDetalleOld.pagoDetalles.forEach(element => {
          if (+element.cpId === 1 || +element.cpId === 13 || +element.cpId === 121
            || +element.cpId === 122 || +element.cpId === 41 || +element.cpId === 120) {
              this.agregarDetalleTabla(element)
          }
        });
        //this.detalleCostoDataSource = new MatTableDataSource(this.data.dotacionDetalleOld.pagoDetalles);
      }
    }
  }

  addDetalleCosto() {
    if (this.detalleCostosGroup.valid) {

      if (!this.validateConceptoPagoExist()) {
        this.pagoDetalle = new PagoDetalleDTO()
        this.pagoDetalle.cpId = this.detalleCostosGroup.controls['conceptoCosto'].value.split(",", 1)[0]
        this.pagoDetalle.mont = this.detalleCostosGroup.controls['monto'].value
        this.pagoDetalle.cpDes = this.detalleCostosGroup.controls['conceptoCosto'].value.split(",", 2)[1]

        this.agregarDetalleTabla(this.pagoDetalle);
      } else {
        this.alert("info", "Concepto Pagos", "Ya existe el Concepto de Pago ingresado")
      }
    }
  }

  validateConceptoPagoExist() {
    let flag: boolean = false;
    this.pagoDetalles.forEach(x => {
      if (x.cpId === this.detalleCostosGroup.controls['conceptoCosto'].value.split(",", 1)[0]) {
        flag = true;
      }
    })
    return flag;
  }

  agregarDetalleTabla(pagoDetalle: PagoDetalleDTO) {

    this.pagoDetalles.push(pagoDetalle);
    this.detalleCostoDataSource = new MatTableDataSource(this.pagoDetalles);

    this.dataDetalleCosto = true;

    this.detalleCostosGroup.clearValidators()
    this.detalleCostosGroup.reset()
    //this.detalleCostosGroup.controls['conceptoCosto'].setValue(1);
  }

  // eliminarDetalleCosto(i: any) {
  //   this.pagoDetalles.splice(i, 1);
  //   this.detalleCostoDataSource = new MatTableDataSource(this.pagoDetalles);
  // }

  close(data?: any) {
    this.dialogRef.close(data)
  }

  addConceptoPagos() {
    let sueldoBase = 0
    let asignacionFamiliar = 0
    let indiceHora125 = 0
    let indiceHora135 = 0
    let movilidad = 0
    let provision = 0
    let sueldoPuesto = 0
    let efectivo = 0

    this.pagoDetalles.forEach(x => {
      if (+x.cpId === 1) 
        sueldoBase = x.mont
      if (+x.cpId === 13)
        asignacionFamiliar = x.mont
      if (+x.cpId === 121)
        indiceHora125 = x.mont
      if (+x.cpId === 122)
        indiceHora135 = x.mont
      if (+x.cpId === 41)
        movilidad = x.mont
      if (+x.cpId === 120)
        provision = x.mont
    })

    //Importe H.25%
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 6
    this.pagoDetalle.mont = Number(((sueldoBase + asignacionFamiliar) / 30 / 8 * 1.25 * indiceHora125).toFixed(2))
    this.pagoDetalle.cpDes = 'Horas Extra 25%'
    this.pagoDetalles.push(this.pagoDetalle)

    //Importe H.35%
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 7
    this.pagoDetalle.mont = Number(((sueldoBase + asignacionFamiliar) / 30 / 8 * 1.35 * indiceHora135).toFixed(2))
    this.pagoDetalle.cpDes = 'Horas Extra 35%'
    this.pagoDetalles.push(this.pagoDetalle)

    //Proporc Feriado
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 66
    this.pagoDetalle.mont = Number(((sueldoBase + asignacionFamiliar) / 30 * 2).toFixed(2))
    this.pagoDetalle.cpDes = 'Horas Extra Dia Feriado'
    this.pagoDetalles.push(this.pagoDetalle)

    //SUELDO PUESTO
    sueldoPuesto = (sueldoBase + asignacionFamiliar + ((sueldoBase + asignacionFamiliar) / 30 / 8 * 1.25 * indiceHora125) + ((sueldoBase + asignacionFamiliar) / 30 / 8 * 1.35 * indiceHora135) + ((sueldoBase + asignacionFamiliar) / 30 * 2))

    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 123
    this.pagoDetalle.mont = Number(sueldoPuesto.toFixed(2))
    this.pagoDetalle.cpDes = 'Sueldo Puesto'
    this.pagoDetalles.push(this.pagoDetalle)

    //SCTR
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 102
    this.pagoDetalle.mont = Number((sueldoPuesto * this.sctrSuperficie).toFixed(2))
    this.pagoDetalle.cpDes = 'SCTR'
    this.pagoDetalles.push(this.pagoDetalle)

    //VIDA LEY
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 119
    this.pagoDetalle.mont = Number((sueldoPuesto * this.vidaLey).toFixed(2))
    this.pagoDetalle.cpDes = 'Seguro Vida Ley'
    this.pagoDetalles.push(this.pagoDetalle)

    //EsSALUD
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 118
    this.pagoDetalle.mont = Number((sueldoPuesto * this.esSalud).toFixed(2))
    this.pagoDetalle.cpDes = 'ESSALUD'
    this.pagoDetalles.push(this.pagoDetalle)

    //CTS
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 21
    this.pagoDetalle.mont = Number(((sueldoPuesto + (sueldoPuesto / 6)) / 12).toFixed(2))
    this.pagoDetalle.cpDes = 'CTS'
    this.pagoDetalles.push(this.pagoDetalle)

    //GRATIF.
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 18
    this.pagoDetalle.mont = Number((sueldoPuesto / 6).toFixed(2))
    this.pagoDetalle.cpDes = 'Gratificación Ordinaria'
    this.pagoDetalles.push(this.pagoDetalle)

    //VACACIONES
    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 35
    this.pagoDetalle.mont = Number((sueldoPuesto / 12).toFixed(2))
    this.pagoDetalle.cpDes = 'Vacaciones'
    this.pagoDetalles.push(this.pagoDetalle)

    //EFECTIVO
    efectivo = sueldoPuesto + (sueldoPuesto * this.sctrSuperficie) + (sueldoPuesto * this.vidaLey) + (sueldoPuesto * this.esSalud) + (((sueldoPuesto + (sueldoPuesto / 6)) / 12)) + (sueldoPuesto / 6) + (sueldoPuesto / 12)

    this.pagoDetalle = new PagoDetalleDTO()
    this.pagoDetalle.cpId = 124
    this.pagoDetalle.mont = Number(efectivo.toFixed(2))
    this.pagoDetalle.cpDes = 'Efectivo'
    this.pagoDetalles.push(this.pagoDetalle)

    //TOTAL MOVILIDAD
    this.totalMovilidad = Number((movilidad * this.nuevoConsolidadoGroup.controls['cantidad'].value).toFixed(2))
    //TOTAL PROVIS
    this.totalProvisiones = Number((provision * this.nuevoConsolidadoGroup.controls['cantidad'].value).toFixed(2))
    //TOTAL MOV+PROVIS
    this.totalMovProv = this.totalMovilidad + this.totalProvisiones
    //TOTAL EFECTIVO / TOTAL PERSONAS
    this.totalEfectivo = Number((efectivo * this.nuevoConsolidadoGroup.controls['cantidad'].value).toFixed(2))
    //TOTAL CONCEPTOS
    this.totalConceptos = this.totalMovProv + this.totalEfectivo

  }

  guardar() {
    if (this.nuevoConsolidadoGroup.valid) {

      // Filtrar solo los que tengan check y minimizar los atributos necesarios
      this.pagoDetalles = this.pagoDetalles
        .filter((item) => item.checked === true)
        .map(({cpId, cpDes, mont}) => {
          const pagoDetalle = new PagoDetalleDTO();
          pagoDetalle.cpId  = cpId;
          pagoDetalle.cpDes = cpDes;
          pagoDetalle.mont  = mont;
  
          return pagoDetalle;
        });

      this.addConceptoPagos()
      // console.log(this.nuevoConsolidadoGroup)
      this.dotacionDetalle = new DotacionDetalleDTO();
      this.dotacionDetalle.cant = this.nuevoConsolidadoGroup.controls['cantidad'].value
      this.dotacionDetalle.montMovProv = Number(this.totalMovProv.toFixed(2))
      this.dotacionDetalle.montEfect = Number(this.totalEfectivo.toFixed(2))
      this.dotacionDetalle.montTotCncp = Number(this.totalConceptos.toFixed(2))
      this.dotacionDetalle.montTotMov = Number(this.totalMovilidad.toFixed(2))
      this.dotacionDetalle.montTotProv = Number(this.totalProvisiones.toFixed(2))

      this.dotacionDetalle.planId = this.nuevoConsolidadoGroup.controls['planilla'].value.split(",", 1)[0]
      this.dotacionDetalle.planDes = this.nuevoConsolidadoGroup.controls['planilla'].value.split(",", 2)[1]
      this.dotacionDetalle.ugesId = this.selectedUnidId
      this.dotacionDetalle.ugesDes = this.nuevoConsolidadoGroup.controls['ugestion'].value.split(",", 2)[1]
      // console.log(this.dotacionDetalle.ugesId)
      // console.log(this.dotacionDetalle.ugesDes)
      this.dotacionDetalle.tctoId = this.nuevoConsolidadoGroup.controls['tipoContrato'].value.split(",", 1)[0]
      this.dotacionDetalle.tctoDes = this.nuevoConsolidadoGroup.controls['tipoContrato'].value.split(",", 2)[1]
      this.dotacionDetalle.ccosId = this.selectedCCostosId;
      this.dotacionDetalle.ccosDes = this.nuevoConsolidadoGroup.controls['centroCostos'].value.split(",", 2)[1]
      // console.log(this.dotacionDetalle.ccosId)
      // console.log(this.dotacionDetalle.ccosDes)
      this.dotacionDetalle.zonId = this.nuevoConsolidadoGroup.controls['zona'].value.split(",", 1)[0]
      this.dotacionDetalle.zonDes = this.nuevoConsolidadoGroup.controls['zona'].value.split(",", 2)[1]
      this.dotacionDetalle.cargId = this.selectedCargosId
      this.dotacionDetalle.cargDes = this.nuevoConsolidadoGroup.controls['cargo'].value.split(",", 2)[1]
      // console.log(this.dotacionDetalle.cargId)
      // console.log(this.dotacionDetalle.cargDes)
      this.dotacionDetalle.pagoDetalles = this.pagoDetalles;

      // console.log(JSON.stringify(this.dotacionDetalle))
      this.close(this.dotacionDetalle)
    }
  }

  public getPlanillas() {
    this.construtechService.getPlanillasPorEmpresa("", this.empresaId)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.listPlanilla = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          // console.log(JSON.stringify(err))
        }
      )
  }

  public getUgestionV2() {
    this.busquedaFilter = new FiltroDTO()
    this.busquedaFilter.filterEmpId = this.empresaFilter
    this.busquedaFilter.filterUproId = this.unidadProyectoFilter
    this.busquedaFilter.filterPlanId = this.planillaFilter

    this.construtechService.getUgestion( this.busquedaFilter)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.listUnidadGestion = res.data
            this.filteredObjetosUgestion = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          // console.log(JSON.stringify(err))
        }
      )
  }

  public getCcostosV2() {
    this.busquedaFilter = new FiltroDTO()
    this.busquedaFilter.filterEmpId = this.empresaFilter
    this.busquedaFilter.filterUproId = this.unidadProyectoFilter
    this.busquedaFilter.filterPlanId = this.planillaFilter
    this.busquedaFilter.filterUgesId = this.ugestionFilter

    this.construtechService.getCcostos(this.busquedaFilter)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.listCentroCostos = res.data
            this.filteredObjetosCCostos = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          // console.log(JSON.stringify(err))
        }
      )
  }

  public getCargosV3() {

    this.busquedaFilter = new FiltroDTO()
    this.busquedaFilter.filterEmpId = this.empresaFilter
    this.busquedaFilter.filterUproId = this.unidadProyectoFilter
    this.busquedaFilter.filterPlanId = this.planillaFilter

    this.construtechService.getCargosV4(this.busquedaFilter)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.listCargos = res.data
            this.filteredObjetosCargos = res.data
          } else {
            this.alert("error", "Filtros", res.mensaje)
          }
        },
        err => {
          // console.log(JSON.stringify(err))
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

  extraerMontos() {
    // console.log(this.pagoDetalles);
    this.pagoDetalles.forEach((item) => {
      item.loading = true;
      this.extraerMonto2(item.cpId)
        .subscribe(
          res => {
            if (res.codigo === 1000) {
              item.mont = Number(res.data);
              item.message = '';
            } else {
              item.mont = 0;
              item.message = 'No se encontró monto en el histórico.';
            }
            item.loading = false;
          },
          err => {
            item.message = 'Ocurrió un error en la búsqueda.';
            item.loading = false;
          }
        )
    })
  }

  extraerMonto2(conceptoCostoId) {
    const planilla =this.nuevoConsolidadoGroup.get('planilla').value.split(',')

    this.filtro = new FiltroDTO()
    this.filtro.filterCpddConpId = conceptoCostoId
    this.filtro.filterDdetUgesId = this.selectedUnidId
    this.filtro.filterDdetCargId = this.selectedCargosId
    this.filtro.filterDdetPlanId = planilla[0]

    return this.construtechService.extraerMonto(this.filtro);
  }

  // public extraerMonto(){

  //   const ugestion = this.nuevoConsolidadoGroup.get('ugestion').value.split(',')
  //   const planilla =this.nuevoConsolidadoGroup.get('planilla').value.split(',')
  //   const cargo =this.nuevoConsolidadoGroup.get('cargo').value.split(',')
  //   const conceptoCosto = this.detalleCostosGroup.get('conceptoCosto').value.split(',')

  //   // console.log(ugestion[0])
  //   // console.log(planilla[0])
  //   // console.log(cargo[0])
  //   // console.log(conceptoCosto[0])

  //   this.filtro = new FiltroDTO()

  //   this.filtro.filterCpddConpId = conceptoCosto[0]
  //   this.filtro.filterDdetUgesId = this.selectedUnidId
  //   this.filtro.filterDdetCargId = this.selectedCargosId
  //   this.filtro.filterDdetPlanId = planilla[0]



  //   this.construtechService.extraerMonto(this.filtro)
  //     .subscribe(
  //       res => {
  //         if (res.codigo === 1000) {
  //           // console.log(res.data)
  //           this.detalleCostosGroup.get('monto').setValue(res.data);
  //           this.ErrorMontoHistorico = false;
  //         } else {
  //           // console.log("no hay")
  //           this.detalleCostosGroup.get('monto').setValue("");
  //           this.ErrorMontoHistorico = true;
  //         }
  //       },
  //       err => {
  //         // console.log(JSON.stringify(err))
  //       }
  //     )

  // }

  public filterOptionsUgestion() {
    // console.log(this.searchTermUgestion)
    // console.log(this.filteredObjetosUgestion)
    /*if(this.searchTermUgestion.includes(",")) {
      const id = this.searchTermUgestion.split(",")
      this.searchTermUgestion = id[1]
    }*/
    if (typeof this.searchTermUgestion === 'string' && this.searchTermUgestion.trim() !== '') {
      const searchTermLower = this.searchTermUgestion.toLowerCase();
      this.filteredObjetosUgestion = this.listUnidadGestion.filter(objeto =>
        objeto.unidNombre.toLowerCase().includes(searchTermLower)
      );
      // console.log(this.filteredObjetosUgestion)
    } else {
      this.filteredObjetosUgestion = this.listUnidadGestion;
    }
  }

  public seleccionarUproyecto(event: MatAutocompleteSelectedEvent) {
   
    
    this.selectedUnidId = event.option.value.split(",", 2)[0];
     
      const selectedUnidnombre = event.option.value.split(",", 2)[1];

      this.searchTermUgestion = selectedUnidnombre
      
    
  }

  public filterOptionsCCostos() {
    // console.log(this.searchTermCCostos)
    // console.log(this.filteredObjetosCCostos)
    /*if(this.searchTermCCostos.includes(",")) {
      const id = this.searchTermCCostos.split(",")
      this.searchTermCCostos = id[1]
    }*/
    if (typeof this.searchTermCCostos === 'string' && this.searchTermCCostos.trim() !== '') {
      const searchTermLower = this.searchTermCCostos.toLowerCase();
      this.filteredObjetosCCostos = this.listCentroCostos.filter(objeto =>
        objeto.unidNombre.toLowerCase().includes(searchTermLower)
      );
      // console.log(this.filteredObjetosCCostos)
    } else {
      this.filteredObjetosCCostos = this.listCentroCostos;
    }
  }

  public seleccionarCCostos(event: MatAutocompleteSelectedEvent) {
    this.selectedCCostosId = event.option.value.split(",", 2)[0];
    const selectedUnidnombre = event.option.value.split(",", 2)[1];

    this.searchTermCCostos = selectedUnidnombre
  }

  public filterOptionsCargos() {
    // console.log(this.searchTermCargos)
    // console.log(this.filteredObjetosCargos)
    /*if(this.searchTermCargos.includes(",")) {
      const id = this.searchTermCargos.split(",")
      this.searchTermCargos = id[1]
    }*/
    if (typeof this.searchTermCargos === 'string' && this.searchTermCargos.trim() !== '') {
      const searchTermLower = this.searchTermCargos.toLowerCase();
      this.filteredObjetosCargos = this.listCargos.filter(objeto =>
        objeto.cargDescripcion.toLowerCase().includes(searchTermLower)
      );
      // console.log(this.filteredObjetosCargos)
    } else {
      this.filteredObjetosCargos = this.listCargos;
    }
  }

  public seleccionarCargos(event: MatAutocompleteSelectedEvent) {
    this.selectedCargosId = event.option.value.split(",", 2)[0];
    const selectedUnidnombre = event.option.value.split(",", 2)[1];

    this.searchTermCargos = selectedUnidnombre
  }

}
