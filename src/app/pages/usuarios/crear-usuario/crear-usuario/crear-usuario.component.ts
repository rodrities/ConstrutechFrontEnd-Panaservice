import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentoDTO } from 'src/app/shared/model/database-dto/documentoDTO';
import { PersonaDTO } from 'src/app/shared/model/database-dto/personaDTO';
import { PersonaRequestDTO } from 'src/app/shared/model/database-dto/personaRequestDTO';
import { TipoDocumento } from 'src/app/shared/model/database-entities/tipoDocumento';
import { UsuarioRequestDTO } from 'src/app/shared/model/database-dto/usuarioRequestDTO';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { PerfilDTO } from 'src/app/shared/model/database-dto/perfilDTO';
import { PlanillaDetalleDTO } from 'src/app/shared/model/database-dto/planillaDetalleDTO';
import { PlanillaDTO } from 'src/app/shared/model/database-dto/planillaDTO';
import { ResponseDTO } from 'src/app/shared/model/responseDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { planillaUsuario } from 'src/app/shared/model/database-entities/planillaUsuarios';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class CrearUsuarioComponent implements OnInit {

  @ViewChild('crearUsuarioForm') crearUsuarioForm: NgForm;
  @ViewChild('buscarPersonaForm') buscarPersonaForm: NgForm;
  
  tipoDocumento = new FormControl(1);
  perfil = new FormControl(1);
  planilla = new FormControl();
  unidades = new FormControl([]);;

  planillasGet: PlanillaDTO;
  uProyectoGet: UnidadDTO[];

  planillaDetalle: planillaUsuario[] = [];

  filtro: FiltroDTO;

  requestPersonaDTO: PersonaRequestDTO;
  
  personaDTO = new PersonaDTO();
  crearUsuarioRequest = new UsuarioRequestDTO();

  crearPersona: boolean = true;
  showPlanillaWarning: boolean = false;

  tipoDocList : TipoDocumento[];
  perfilList : PerfilDTO[];
 

  public isBuscarDisabled: boolean = true;
  public isCrearDisabled: boolean = true;
  public inputsDeshabilitados: boolean = false;
  public showPassword: boolean = false;

  buscarPersona: NgForm;
  requestBuscarPersona: PersonaRequestDTO = new PersonaRequestDTO();
  
  constructor(
    private construtechService: ConstrutechService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {


    this.getTipoDocumentos();
    this.getPerfiles();
    this.buscarPlanillas();


  }

  public getPersonaPorDoc() {
    this.spinner.show();
    this.requestPersonaDTO = new PersonaRequestDTO()
    this.requestPersonaDTO.numDoc = this.requestBuscarPersona.numDoc;
    this.requestPersonaDTO.tipoDoc = this.requestBuscarPersona.tipoDoc;


    this.construtechService.getPersonaPorDoc(this.requestPersonaDTO)
      .subscribe(
        res => {
          if (res.data !== null) {
            console.log(res.data)
            this.personaDTO = res.data
            this.spinner.hide();
            this.crearPersona = false
            this.inputsDeshabilitados = true
          } else {
            console.log(res.data)
            this.crearPersona = true
            this.spinner.hide();
            //this.alert("info", "Usuarios", res.mensaje)
          }
        }
      )
  }

  public crearUsuario() {
    this.spinner.show();
    this.pushPlanillaDetail();
    this.crearUsuarioRequest.perTdocId = 1;
    this.crearUsuarioRequest.perNuDoc = this.requestBuscarPersona.numDoc;
    this.crearUsuarioRequest.perNombres = this.personaDTO.perNombres;
    this.crearUsuarioRequest.perApellidoPat = this.personaDTO.perApePaterno;
    this.crearUsuarioRequest.perApellidoMat = this.personaDTO.perApeMaterno;
    this.crearUsuarioRequest.perCorreo = this.personaDTO.perCorreo;
    this.crearUsuarioRequest.perNuTelefono = this.personaDTO.perNuTelefono;
    this.crearUsuarioRequest.usuCorreo = this.personaDTO.perCorreo;
    this.crearUsuarioRequest.usuEmpId = 1;
    this.crearUsuarioRequest.crearPersona = this.crearPersona;
    this.crearUsuarioRequest.usuPerId = this.personaDTO.perId;
    this.crearUsuarioRequest.usuAplId = 2;
    this.crearUsuarioRequest.planillaDetalle = this.planillaDetalle
    
    console.log(this.crearUsuarioRequest)

    this.construtechService.createUsuario(this.crearUsuarioRequest)
      .subscribe( res => {
        //window.location.reload();
        console.log(res)
        this.spinner.hide();
        this.router.navigate(['/usuarios']);
      })

  }

  public verificarCamposCrearsuario(): void {
    // Verificar los campos requeridos y actualizar el estado del botón "BUSCAR"
    this.isCrearDisabled = !(this.requestBuscarPersona.numDoc &&
       this.personaDTO.perNombres &&
       this.personaDTO.perApePaterno && 
       this.personaDTO.perApeMaterno &&
       this.personaDTO.perCorreo &&
       this.crearUsuarioRequest.usuClave &&
       this.planilla.value &&
       this.unidades.value[0]
       );
  }

  public limpiarFormulario(): void {
    this.crearUsuarioForm.reset();
    this.buscarPersonaForm.reset();
    this.inputsDeshabilitados = false;
  }

  public getTipoDocumentos() {
    this.construtechService.getTipoDocumentos()
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.tipoDocList = res.data
            this.requestBuscarPersona.tipoDoc = 1;
          } /*else {
            this.alert("error", "Filtros", res.mensaje)
          }*/
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  public getPerfiles() {
    this.construtechService.getPerfiles()
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.perfilList = res.data
            console.log(res.data)
            this.crearUsuarioRequest.usupPerfId = 1
          } /*else {
            this.alert("error", "Filtros", res.mensaje)
          }*/
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  public buscarPlanillas(){

    this.construtechService.getPlanilla_v4().subscribe(
      (resp: ResponseDTO<PlanillaDTO>) => {
        this.planillasGet = resp.data;

        console.log(this.planillasGet)
      }
    )

  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getProyectos() {
    this.showPlanillaWarning = false;
    console.log(this.planilla)
    let filtro = new FiltroDTO();
    filtro.filterPlanId = this.planilla.value
    this.construtechService.getUproyecto(filtro).subscribe(
      (resp: ResponseDTO<UnidadDTO[]>) => {
        this.uProyectoGet = resp.data;
        console.log(this.uProyectoGet)
      }
    )
  }

  pushPlanillaDetail() {

    this.planillaDetalle = []

    for (const iterator of this.unidades.value) {
      let demoPlanDetalle = new planillaUsuario();
      demoPlanDetalle.planId = this.planilla.value;
      demoPlanDetalle.uproId = iterator
      this.planillaDetalle.push(demoPlanDetalle)
    }

    console.log(this.planillaDetalle)
  }


  validatePlanilla(){
    console.log(this.planilla.value)
    if (!this.planilla.value) {
      this.showPlanillaWarning = true
    }else{
      return
    }
  }

  show(){
    console.log(this.planilla, this.unidades)
  }
  
  


}
