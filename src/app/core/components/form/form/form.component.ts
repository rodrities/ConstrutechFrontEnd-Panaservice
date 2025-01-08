import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AtraccionTalentoComponent } from 'src/app/pages/atraccion-talento/atraccion-talento/atraccion-talento.component';
import { AtraccionTalentoDTO } from 'src/app/shared/model/database-dto/atraccionTalento';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { UtilTools } from 'src/app/shared/util/util-tools';
import Swal from 'sweetalert2';
import dep from 'src/assets/json/departamentos.json'
import { VacanteDetalleDTO } from 'src/app/shared/model/database-dto/vacanteDetalleDTO';
export interface User {
  name: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  //CONDICIONALES
  proyectoDisabled: boolean = true;
  uniGDisabled: boolean = true;
  centrocDisabled: boolean = true;
  cargosDisabled: boolean = true;

  buttonActive: boolean = false;

  panelOpenState = false;
  check_panel = false;

  showPersonSelect: boolean = true;
  showDefaultOption: boolean = true;

  disabledInputEmo: boolean = true;
  disabledInputInd: boolean = true;

  cameFromSelection: boolean = false;
  hideRadio: boolean = true;
  isDisabled: boolean = false;
  dniDisabled: boolean = false;
  

  //DATA
  operacion: string[] = ['BATEAS', 'CDA', 'CORI PUNO'];
  servicio: string[] = ['ALIMENTACION', 'HOTELERIA'];
  RNS: string[] = ['R'];
  motivo: string[] = ['RENUNCIA VOLUNTARIA', 'NUEVO SERVICIO / PUESTO', 'ABANDONO DE TRABAJO', 'NO RENOVACIÓN'];
  estado: string[] = ['CONVOCATORIA', 'EN INCORPORACION', 'ENTREVISTA POR CLIENTE', 'VALIDACIÓN', 'REQUERIMIENTO SUSPENDIDO'];
  proceso: string[] = ['ACTIVO', 'PENDIENTE', 'CERRADO']
  departamentos: any[] = [];

  dni: any;
  filtro: FiltroDTO;
  pageSize: number = 10
  pageNumber: number = 0
  length: number;

  persona: any = {};
  persona_AT: any = {
    techAtracInduccion: null,
    techAtracServicio: null
  };

  planillas: any[] = [];
  proyectos: any[] = [];
  uniG: any[] = [];
  centroC: any[] = [];
  cargosA: any[] = [];


  //ID SELECCIONADAS
  planIdSelected: number;
  proyIdSelected: number;
  unidGIdSelected: number;
  centroCIdSelected: number;
  cargoIdSelected: number;

  currencyValue: string = '';
  atraccionTalent: AtraccionTalentoComponent;

  vacanteDetalle: VacanteDetalleDTO[];
  selectedPostulante: VacanteDetalleDTO = new VacanteDetalleDTO();

  constructor(
    private dialog: MatDialog,
    private construtechService: ConstrutechService,
    private fb: FormBuilder,
    private utils: UtilTools,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public inputData: any
  ) {
    this.departamentos = dep;
  }

  ngOnInit(): void {
    if (this.inputData) {
      this.dni = this.inputData;
      this.dniDisabled = true;
      this.onSearch();
    }

    this.getVacanteDetalle()
  }

  closeModal(): void {
    this.dialog.closeAll();
    this.persona = {};
    this.persona_AT = {};
  }

  showDropdown(bool: boolean) {
    this.buttonActive = true;
    this.check_panel = true;
    this.showPersonSelect = bool;
    this.persona_AT = {};
    this.persona = {};
    this.dni = '';
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  onSearch() {
    this.persona = {};
    this.persona_AT.techAtracSalBas = null;
    this.spinner.show();
    this.filtro = new FiltroDTO()
    this.filtro.filterPerDoc = this.dni;
    this.filtro.pageNumber = this.pageNumber;
    this.filtro.pageSize = this.pageSize;
    this.construtechService.listPersonal(this.filtro).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res)
        if (res.codigo === 1000 && res.data.content.length > 0) {
          this.utils.CloseTimer()
          Swal.fire({
            type: "success",
            title: "Empleado encontrado",
            html: res.mensaje,
            confirmButtonColor: this.translate.instant("alert.alert_button_color"),
          });

          if (this.inputData) {
            this.buttonActive = true;
            this.check_panel = true;
            this.showPersonSelect = false;
            this.cameFromSelection = true;
            this.hideRadio = false;
            this.isDisabled = true;
          }

          this.persona = res.data.content[0];
          this.persona.perApellidos = this.persona.perApePaterno + " " + this.persona.perApeMaterno;
          this.persona_AT.techAtracPlandpId = this.persona.persPlanillaDetallePId
          this.listSueldo(this.persona.pladId);
        } else {
          Swal.fire({
            type: "info",
            title: "Empleado no encontrado",
            html: res.mensaje,
            confirmButtonColor: this.translate.instant("alert.alert_button_color")
          });
        }
      },
      error => {
        this.spinner.hide();
        Swal.fire({
          type: "error",
          title: "Ocurrió un error",
          html: error.mensaje,
          confirmButtonColor: this.translate.instant("alert.alert_button_color")
        });
      })
  }

  listSueldo(id: number) {
    this.construtechService.listSueldo(id).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          this.formatSueldo(res.techAtracSalBas)
        }
      },
      error => {
        console.log(error)
      }
    )
  }


  save() {
    this.spinner.show();
    this.sueldoToNumber();
    this.persona_AT.techAtracDni = this.persona_AT.techAtracDni?.toString();
    const instanciaDTO = new AtraccionTalentoDTO(this.persona_AT);

    this.construtechService.saveAtraccionT(instanciaDTO, this.persona_AT.techAtracInduccionArch, this.persona_AT.techAtracEmoArch).subscribe(
      (res) => {
        console.log(res)
        this.spinner.hide();
        Swal.fire({
          type: "success",
          title: "Registro realizado",
          html: res.mensaje,
          confirmButtonColor: this.translate.instant("alert.alert_button_color"),
          timer: 3000
        });
        this.persona = {};
        this.persona_AT = {};
      }, (error) => {
        console.log(error)
        this.spinner.hide();
        Swal.fire({
          type: "error",
          title: "Ocurrió un error",
          html: error.mensaje,
          confirmButtonColor: this.translate.instant("alert.alert_button_color")
        });
      })
  }

  sueldoToNumber() {
    if (this.persona_AT.techAtracSalBas) {
      console.log(this.persona_AT.techAtracSalBas)
      let sueldo: string = this.persona_AT.techAtracSalBas;
      let sueldoString: string = sueldo.split("/").pop();
      let sueldoInt = parseFloat(sueldoString.replace(",", ""));
      this.persona_AT.techAtracSalBas = sueldoInt
    } else {
      this.persona_AT.techAtracSalBas = null
    }

  }

  getIdPlan(idPlan: number) {
    this.persona_AT.techAtracPlandId = Number(idPlan);
  }

  //Formato moneda de sueldo a soles

  formatCurrency(event: any, blur: boolean = false) {
    let input = event.target;
    let input_val = input.value;

    if (input_val === '') {
      return;
    }

    let original_len = input_val.length;
    let caret_pos = input.selectionStart;

    if (input_val.indexOf('.') >= 0) {
      let decimal_pos = input_val.indexOf('.');
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      left_side = this.formatNumber(left_side);
      right_side = this.formatNumber(right_side);

      if (blur) {
        right_side += '00';
      }

      right_side = right_side.substring(0, 2);

      input_val = 'S/' + left_side + '.' + right_side;
    } else {
      input_val = this.formatNumber(input_val);
      input_val = 'S/' + input_val;

      if (blur) {
        input_val += '.00';
      }
    }
    this.persona_AT.techAtracSalBas = input_val;

    let updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input.setSelectionRange(caret_pos, caret_pos);
  }

  formatNumber(n: string) {
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatSueldo(sueldo: number) {
    let formattedNumber = sueldo.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }).replace(/\s/g, '');
    this.persona_AT.techAtracSalBas = formattedNumber
  }

  //Obtener Planilla Detalle id

  getPlanillas() {
    if (this.planillas.length > 1) {
      return
    } else {
      this.construtechService.listPlanillas().subscribe(
        (res) => {
          this.planillas = res;
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  getProyecto(idPlan: number) {
    this.uniGDisabled = true;
    this.centrocDisabled = true;
    this.cargosDisabled = true;

    this.proyectos = [];
    this.uniG = [];
    this.centroC = [];
    this.cargosA = [];

    this.construtechService.listProoyectos(idPlan).subscribe(
      (res) => {
        this.proyectos = res;
        this.proyectoDisabled = false;
        this.planIdSelected = idPlan;
        console.log(res)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getUnidadGestion(idProy: number) {
    console.log(idProy)
    this.filtro = new FiltroDTO()

    this.filtro.filterPlanId = this.planIdSelected;
    this.filtro.filterProyId = idProy;

    this.construtechService.listUnidGestion(this.filtro).subscribe(
      (res) => {
        this.uniG = res;
        this.uniGDisabled = false;
        this.proyIdSelected = idProy;
        console.log(res)
      }
    )
  }

  getCentroCosto(iduGes: number) {
    this.filtro = new FiltroDTO()
    this.filtro.filterPlanId = this.planIdSelected;
    this.filtro.filterProyId = this.proyIdSelected;
    this.filtro.filterUgesId = iduGes;

    this.construtechService.listCentC(this.filtro).subscribe(
      (res) => {
        console.log(res)
        this.centroC = res;
        this.centrocDisabled = false;
        this.unidGIdSelected = iduGes;
      },
      (error) => {

      }
    )
  }

  getCargos(idCcost: number) {
    this.filtro = new FiltroDTO()
    this.filtro.filterPlanId = this.planIdSelected;
    this.filtro.filterProyId = this.proyIdSelected;
    this.filtro.filterUgesId = this.unidGIdSelected;
    this.filtro.filterCcosId = idCcost;

    this.construtechService.listCargos(this.filtro).subscribe(
      (res) => {
        console.log(res)
        this.cargosA = res;
        this.cargosDisabled = false;
        this.centroCIdSelected = idCcost;
      },
      (error) => {

      }
    )
  }


  //Obtener arch por medio del event

  onFileSelectedInd(event: any) {
    const file: File = event.target.files[0];
    console.log(file)
    this.persona_AT.techAtracInduccionArch = file;
    console.log(this.persona_AT)
  }

  onFileSelectedEmo(event: any) {
    const file: File = event.target.files[0];
    console.log(file)
    this.persona_AT.techAtracEmoArch = file;
    console.log(this.persona_AT)
  }

  //Cambiar estado del input file

  changeState(name) {
    this[name] = false;
  }


  formatCeseDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || 'Sin Información';
  }

  getVacanteDetalle() {

    console.log("VACANTE")
  
    this.construtechService.getVacantesDetallesPorVacanteIncorporados()
    .subscribe(
      res => {
        if (res.codigo === 1000 || res.codigo === 1044) {
          console.log(res.data)
          this.vacanteDetalle = res.data
        } else {
          
        }
      },
      err => {
        console.log(JSON.stringify(err))
      }
    )
  }

  selectPostulante(selectedValue: number) {
    console.log(selectedValue)
    this.selectedPostulante = this.vacanteDetalle.find(v => v.vacdId == selectedValue);
  
    
    console.log(this.selectedPostulante);
    this.persona_AT.techAtracNombresp = this.selectedPostulante.postulante.postNombres
    this.persona_AT.techAtracApellidosp = this.selectedPostulante.postulante.postApellidos
    this.persona_AT.techAtracDni = this.selectedPostulante.postulante.postDni
    this.persona_AT.techAtracProcedencia = this.selectedPostulante.postulante.postCiudad

  }

}
