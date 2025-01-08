import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PerfilDTO } from 'src/app/shared/model/database-dto/perfilDTO';
import { PersonaDTO } from 'src/app/shared/model/database-dto/personaDTO';
import { PersonaRequestDTO } from 'src/app/shared/model/database-dto/personaRequestDTO';
import { PlanillaDTO } from 'src/app/shared/model/database-dto/planillaDTO';
import { PlanillaUsuarioDTO } from 'src/app/shared/model/database-dto/planillaUsuarioDTO';
import { TipoDocumento } from 'src/app/shared/model/database-dto/tipoDocumento';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { UsuarioDTO } from 'src/app/shared/model/database-dto/usuarioDTO';
import { UsuarioRequestDTO } from 'src/app/shared/model/database-dto/usuarioRequestDTO';
import { Estado } from 'src/app/shared/model/database-entities/estado';
import { planillaUsuario } from 'src/app/shared/model/database-entities/planillaUsuarios';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ResponseDTO } from 'src/app/shared/model/responseDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  editarUsuario = new UsuarioDTO();

  @ViewChild('crearUsuarioForm') crearUsuarioForm: NgForm;
  @ViewChild('buscarPersonaForm') buscarPersonaForm: NgForm;
  
  tipoDocumento = new FormControl(1);
  perfil = new FormControl(1);
  estado :  FormControl;
  filtro: FiltroDTO;

  requestPersonaDTO: PersonaRequestDTO;
  
  //
  planillasGet: PlanillaDTO;
  uProyectoGet: UnidadDTO[];
  
  planillaDetalle: planillaUsuario[] = [];

  planilla = new FormControl();
  unidades = new FormControl([]);;
  
  personaDTO = new UsuarioDTO();

  crearUsuarioRequest = new UsuarioRequestDTO();

  crearPersona: boolean = true;

  tipoDocList : TipoDocumento[];
  perfilList : PerfilDTO[];
  usuarioId : number;
  estadoList : Estado[];

  showPlanillaWarning: boolean = false;

  planillaActual: number;


  public isBuscarDisabled: boolean = true;
  public isCrearDisabled: boolean = true;
  public inputsDeshabilitados: boolean = false;
  public showPassword: boolean = false;

  buscarPersona: NgForm;
  requestBuscarPersona: PersonaRequestDTO = new PersonaRequestDTO();
  
  constructor(
    private route: ActivatedRoute,
    private construtechService: ConstrutechService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.usuarioId = params.id;
      this.fetchUsuario(this.usuarioId);
      this.getPlanillaUsuario(this.usuarioId)
      //this.collaboratorId = id;
    });
    this.getEstados();
    this.buscarPlanillas();
    //this.getTipoDocumentos();
    //this.getPerfiles();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
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



  public fetchUsuario(id: number) {
    this.spinner.show();
    
    this.construtechService.getUsuarioById(id)
    .subscribe( res => {
      console.log(res)
      this.personaDTO = res.data
      this.personaDTO.usuClave = ''
      this.spinner.hide();
      this.estado = new FormControl(res.data.usuEstId);
      console.log(this.personaDTO)
    })
  }

  public guardarUsuario() {
    this.spinner.show();
    this.pushPlanillaDetail();
    this.deletePlanillaUsuario(this.usuarioId);
    this.crearUsuarioRequest.usuId = this.usuarioId;
    this.crearUsuarioRequest.perNuDoc = this.personaDTO.perNuDoc;
    this.crearUsuarioRequest.perNombres = this.personaDTO.perNombres;
    this.crearUsuarioRequest.perApellidoPat = this.personaDTO.perApellidoPat;
    this.crearUsuarioRequest.perApellidoMat = this.personaDTO.perApellidoMat;
    this.crearUsuarioRequest.perCorreo = this.personaDTO.perCorreo;
    this.crearUsuarioRequest.perNuTelefono = this.personaDTO.perNuTelefono;
    this.crearUsuarioRequest.usuCorreo = this.personaDTO.usuCorreo;
    this.crearUsuarioRequest.usuEstId = this.personaDTO.usuEstId;
    this.crearUsuarioRequest.usuClave = this.personaDTO.usuClave;
    this.crearUsuarioRequest.planillaDetalle = this.planillaDetalle
    
    console.log(this.crearUsuarioRequest)

    this.construtechService.editUsuario(this.crearUsuarioRequest)
      .subscribe( res => {
        //window.location.reload();
        console.log(res)
        this.spinner.hide();
        this.router.navigate(['/usuarios']);
      })

  }

  public getEstados() {
    this.construtechService.getEstados()
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.estadoList = res.data
            console.log(res.data)
            //this.crearUsuarioRequest.usupPerfId = 1
          } /*else {
            this.alert("error", "Filtros", res.mensaje)
          }*/
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  getProyectos(id? : number) {
    this.showPlanillaWarning = false;
    let filtro = new FiltroDTO();
    if (id) {
      filtro.filterPlanId = id
    }else{
      filtro.filterPlanId = this.planilla.value
    }
    this.construtechService.getUproyecto(filtro).subscribe(
      (resp: ResponseDTO<UnidadDTO[]>) => {
        this.uProyectoGet = resp.data;
        console.log(this.uProyectoGet)
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

  
  validatePlanilla(){
    console.log(this.planilla.value)
    if (!this.planilla.value) {
      this.showPlanillaWarning = true
    }else{
      return
    }
  }


  getPlanillaUsuario(usuId: number){

    let filtro = new FiltroDTO();
    filtro.filterUsuId = usuId;

    this.construtechService.getPlanillaUsuarioPorUserId(filtro).subscribe(
      (resp: PlanillaUsuarioDTO[]) =>{

        let unidadesId: number[] = [];
        resp.forEach(element => {
          unidadesId.push(element.proyId)
        });

        if(resp.length != 0){
          this.planilla.setValue(resp[0].planId)
          this.getProyectos(resp[0].planId);
  
          this.unidades.setValue(unidadesId)
        }else{
          this.planilla.setValue(null)
        }
        
        
      }
    )
  }

  deletePlanillaUsuario(id: number){
    let filtro = new FiltroDTO();
    filtro.filterUsuId = id;
    this.construtechService.deletePlanillaUsuario(filtro).subscribe(
      (resp) => {
        console.log("registros eliminados")
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



  

  show(){
    console.log(this.planilla, this.unidades)
  }

}
