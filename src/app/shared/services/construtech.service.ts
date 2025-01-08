import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Optional } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { CargoDTO } from "../model/database-dto/cargoDTO";
import { EmpresaDTO } from "../model/database-dto/empresaDTO";
import { PlanillaDetalleDTO } from "../model/database-dto/planillaDetalleDTO";
import { PlanillaDTO } from "../model/database-dto/planillaDTO";
import { UnidadDTO } from "../model/database-dto/unidadDTO";
import { PaginadoDTO } from "../model/paginadoDTO";
import { ResponseDTO } from "../model/responseDTO";
import { TIPO_CONTRATOS, ZONAS, CONCEPTO_PAGOS } from "../util/lista.json";
import { FiltroDTO } from "../model/filtroDTO";
import { Persona } from "../model/database-entities/persona";
import { UProyectoDTO } from "../model/database-dto/uproyectoDTO";
import { RusterDTO } from "../model/database-dto/rusterDTO";
import { RolDTO } from "../model/database-dto/rolDTO";
import { ProgramacionDTO } from "../model/database-dto/programacionDTO";
import { RsAuthentication } from "../model/authentication-dto/rs.authentication";

import { UsuarioDTO } from "../model/database-dto/usuarioDTO";
import { PersonaDTO } from "../model/database-dto/personaDTO";
import { PersonaRequestDTO } from "../model/database-dto/personaRequestDTO";
import { UsuarioRequestDTO } from "../model/database-dto/usuarioRequestDTO";
import { TipoDocumento } from "../model/database-entities/tipoDocumento";
import { PerfilDTO } from "../model/database-dto/perfilDTO";

import { DotacionDTO } from "../model/database-dto/dotacionDTO";
import { MasterDTO } from "../model/database-dto/masterDTO";
import { PagoDetalleDTO } from "../model/database-dto/pagoDetalleDTO";
import { personalAtraccionDTO } from "../model/database-dto/personalAtraccionDTO";
import { AtraccionTalentoDTO } from "../model/database-dto/atraccionTalento";

import { tap } from "rxjs/operators";
import { Estado } from "../model/database-entities/estado";
import { AprobadorDTO } from "../model/aprobadorDTO";

import { PlanillaUsuarioDTO } from "../model/database-dto/planillaUsuarioDTO";
import { RosterDetail } from "../model/database-dto/rosterDetail";
import { WebSocketSubject } from 'rxjs/webSocket';
import { NotificacionDTO } from "../model/database-dto/notificacionDTO";
import { VacanteDTO } from "../model/database-dto/vacanteDTO";
import { VacanteDetalleDTO } from "../model/database-dto/vacanteDetalleDTO";
import { PostulanteRequestDTO } from "../model/database-dto/postulanteRequestDTO";


@Injectable({
    providedIn: 'root'
})

export class ConstrutechService {

    private planillaRoster: any;

    private eventSource: EventSource;


    constructor(private http: HttpClient) { 
    }

    authenticate(credentials: string): Observable<RsAuthentication> {
        let formData: FormData = new FormData();
        formData.append("credentialsBase64", credentials);

        return this.http.post<RsAuthentication>(this.routeConstrutech('v2/authenticate'), formData)
            .pipe(
                tap((response: RsAuthentication) => {
                    sessionStorage.setItem('authToken', response.data.accessToken);
                })
            );
    }

    isAuthenticate(): boolean {
        return sessionStorage.getItem('authToken') !== null;
    }

    public getZonas() {
        return ZONAS
    }

    public getTipoContratos() {
        return TIPO_CONTRATOS
    }

    public getConceptoPagos() {
        return CONCEPTO_PAGOS
    }

    //BUSCA MAESTROS DE PERSONAL (DOTACION)
    public getMaster = 
    
    
    
    (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<MasterDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<MasterDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/dotaciones'), body, this.generateHeaders());
    }

    public getConsolidado = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<MasterDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<MasterDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/dotaciones/detalles'), body, this.generateHeaders());
    }

    public getConsolidadoDetalle = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<MasterDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<MasterDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/dotaciones/detalles/detalles'), body, this.generateHeaders());
    }

    public getPagos = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<PagoDetalleDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<PagoDetalleDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/pagos'), body, this.generateHeaders());
    }

    public getSolicitudes = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<MasterDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<MasterDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/solicitudes'), body, this.generateHeaders());
    }

    public getSolicitudesDetalles = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<MasterDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<MasterDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/solicitudes/detalles'), body, this.generateHeaders());
    }

    public getSolicitudesDetallesDetalles = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<MasterDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<MasterDTO>>>(this.routeConstrutech('dotacion/v1.0/filtrar/solicitudes/detalles/detalles'), body, this.generateHeaders());
    }

    //APROBACION / RECHAZO DE SOLICITUD
    public aprobarSolicitud = (body: DotacionDTO): Observable<ResponseDTO<void>> => {
        return this.http.post<ResponseDTO<void>>(this.routeConstrutech('dotacion/v1.0/aprobar'), body, this.generateHeaders());
    }

    //EMPRESAS HIJAS
    public getEmpresas = (): Observable<ResponseDTO<EmpresaDTO[]>> => {
        return this.http.get<ResponseDTO<EmpresaDTO[]>>(this.routeConstrutech('empresa/v1.0/find/child'), this.generateHeaders());
    }

    //BUSCA PLANILLAS
    public getPlanillas = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<PlanillaDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<PlanillaDTO>>>(this.routeConstrutech('planilla/v1.0/find'), body, this.generateHeaders());
    }

    public getPlanillasPorEmpresa = (token: string, empresaId: number): Observable<ResponseDTO<PlanillaDTO[]>> => {
        return this.http.get<ResponseDTO<PlanillaDTO[]>>(this.routeConstrutech('planilla/v1.0/find/' + empresaId));
    }

    //BUSCA PLANILLAS
    public getPlanillas_v2 = (body: FiltroDTO): Observable<ResponseDTO<PlanillaDTO[]>> => {
        return this.http.post<ResponseDTO<PlanillaDTO[]>>(this.routeConstrutech('planilla/v2.0/find'), body, this.generateHeaders());
    }

    //BUSCA PLANILLAS
    public getPlanillas_v3 = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<PlanillaDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<PlanillaDTO>>>(this.routeConstrutech('planilla/v3.0/find'), body, this.generateHeaders());
    }

    public getPlanilla_v4 = () :  Observable<ResponseDTO<PlanillaDTO>> => {
        return this.http.get<ResponseDTO<PlanillaDTO>>(this.routeConstrutech('planilla/v3.0/get'));
    }

    //BUSCA PLANILLAS DETALLES
    public getPlanillaDetalles = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<PlanillaDetalleDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<PlanillaDetalleDTO>>>(this.routeConstrutech('planilla/v1.0/find/details'), body, this.generateHeaders());
    }

    //BUSCA PLANILLAS DETALLES PERSONAL
    public getPlanillaDetallePersonal = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<Persona>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<Persona>>>(this.routeConstrutech('persona/v1.0/find/planilla/detalle'), body, this.generateHeaders());
    }

    //BUSCA UNIDADES PROYECTO
    public getUproyecto = (body: FiltroDTO): Observable<ResponseDTO<UnidadDTO[]>> => {
        return this.http.post<ResponseDTO<UnidadDTO[]>>(this.routeConstrutech('uproyecto/v1.0/find'), body, this.generateHeaders());
    }

    public getUproyectoV2 = (token: string, body: FiltroDTO): Observable<ResponseDTO<UnidadDTO[]>> => {
        return this.http.post<ResponseDTO<UnidadDTO[]>>(this.routeConstrutech('uproyecto/v2.0/find'), body, this.generateHeaders());
    }

    public getUproyectoPorEmpresa = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<UProyectoDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<UProyectoDTO>>>(this.routeConstrutech('uproyecto/v1.1/find'), body, this.generateHeaders());
    }

    //BUSCA UNIDADES GESTION
    public getUgestion = (body: FiltroDTO): Observable<ResponseDTO<UnidadDTO[]>> => {
        return this.http.post<ResponseDTO<UnidadDTO[]>>(this.routeConstrutech('ugestion/v1.0/find'), body, this.generateHeaders());
    }

    public getUgestionV2 = (token: string): Observable<ResponseDTO<UnidadDTO[]>> => {
        return this.http.get<ResponseDTO<UnidadDTO[]>>(this.routeConstrutech('ugestion/v2.0/find'), this.generateHeaders());
    }

    //BUSCA CENTRO COSTOS
    public getCcostos = (body: FiltroDTO): Observable<ResponseDTO<UnidadDTO[]>> => {
        return this.http.post<ResponseDTO<UnidadDTO[]>>(this.routeConstrutech('ccosto/v1.0/find'), body, this.generateHeaders());
    }

    public getCcostosV2 = (token: string): Observable<ResponseDTO<UnidadDTO[]>> => {
        return this.http.get<ResponseDTO<UnidadDTO[]>>(this.routeConstrutech('ccosto/v2.0/find'), this.generateHeaders());
    }

    //BUSCA CARGOS
    public getCargos = (body: FiltroDTO): Observable<ResponseDTO<CargoDTO[]>> => {
        return this.http.post<ResponseDTO<CargoDTO[]>>(this.routeConstrutech('cargo/v1.0/find'), body, this.generateHeaders());
    }

    public getCargosV2 = (body: FiltroDTO): Observable<ResponseDTO<CargoDTO[]>> => {
        return this.http.post<ResponseDTO<CargoDTO[]>>(this.routeConstrutech('cargo/v2.0/find'), body, this.generateHeaders());
    }

    public getCargosV3 = (): Observable<ResponseDTO<CargoDTO[]>> => {
        return this.http.get<ResponseDTO<CargoDTO[]>>(this.routeConstrutech('cargo/v3.0/find'), this.generateHeaders());
    }

    public getCargosV4 = (body: FiltroDTO): Observable<ResponseDTO<CargoDTO[]>> => {
        return this.http.post<ResponseDTO<CargoDTO[]>>(this.routeConstrutech('cargo/v4.0/find'), body, this.generateHeaders());
    }

    // VACANTES
    public getVacantes = (body: FiltroDTO): Observable<ResponseDTO<VacanteDTO[]>> => {
        return this.http.post<ResponseDTO<VacanteDTO[]>>(this.routeConstrutech('vacante/v2.0/find'), body, this.generateHeaders());
    }

    public getVacantesDetallesPorVacante = (body: FiltroDTO): Observable<ResponseDTO<VacanteDetalleDTO[]>> => {
        return this.http.post<ResponseDTO<VacanteDetalleDTO[]>>(this.routeConstrutech('vacanteDetalle/v2.0/find'), body, this.generateHeaders());
    }

    public getVacantesDetallesPorVacanteIncorporados = (): Observable<ResponseDTO<VacanteDetalleDTO[]>> => {
        return this.http.get<ResponseDTO<VacanteDetalleDTO[]>>(this.routeConstrutech('vacanteDetalle/v3.0/find'), this.generateHeaders());
    }

    public getVacantesDetalles = (): Observable<ResponseDTO<VacanteDetalleDTO[]>> => {
        return this.http.get<ResponseDTO<VacanteDetalleDTO[]>>(this.routeConstrutech('vacanteDetalle/v1.0/find'), this.generateHeaders());
    }

    public createVacante = (body: VacanteDTO): Observable<ResponseDTO<VacanteDTO>> => {
        return this.http.post<ResponseDTO<VacanteDTO>>(this.routeConstrutech('vacante/v1.0/create'), body, this.generateHeaders());
    }

    public createPostulante = (body: PostulanteRequestDTO): Observable<ResponseDTO<VacanteDetalleDTO>> => {
        return this.http.post<ResponseDTO<VacanteDetalleDTO>>(this.routeConstrutech('vacanteDetalle/v1.0/create'), body, this.generateHeaders());
    }

    public editVacanteDetalle = (body: VacanteDetalleDTO): Observable<ResponseDTO<VacanteDetalleDTO>> => {
        return this.http.put<ResponseDTO<VacanteDetalleDTO>>(this.routeConstrutech('vacanteDetalle/v1.0/edit'), body, this.generateHeaders());
    }

    //OBTENCION DE DATOS ROSTER
    public getInitialDataRoster = (body: FiltroDTO): Observable<ResponseDTO<RosterDetail[]>> => {
        return this.http.post<ResponseDTO<RosterDetail[]>>(this.routeConstrutech('ruster/v1.0/list/all'), body, this.generateHeaders());
    }

    //OBTENCION DE DATOS ROSTER
    public getInitialDataRoster2 = (body: FiltroDTO): Observable<ResponseDTO<RusterDTO[]>> => {
        return this.http.post<ResponseDTO<RusterDTO[]>>(this.routeConstrutech('ruster/v1.0/list/all2'), body, this.generateHeaders());
    }   

    //VALIDACION DATA ROSTER
    public validateRoster = (body: FiltroDTO): Observable<ResponseDTO<RolDTO[]>> => {
        return this.http.post<ResponseDTO<RolDTO[]>>(this.routeConstrutech('ruster/v1.0/evaluar'), body, this.generateHeaders());
    }

    //GUARDADO DATA ROSTER
    public saveRoster = (body: ProgramacionDTO[]): Observable<ResponseDTO<void>> => {
        return this.http.post<ResponseDTO<void>>(this.routeConstrutech('ruster/v1.0/guardar'), body, this.generateHeaders());
    }

    //PLANILLA USUARIOS
    public getPlanillaUsuarioPorUserId = (body: FiltroDTO) : Observable<PlanillaUsuarioDTO[]> => {
        return this.http.post<PlanillaUsuarioDTO[]>(this.routeConstrutech('planillaUsuario/getByUserId'), body, this.generateHeaders())
    }

    public deletePlanillaUsuario = (body: FiltroDTO): Observable<void> => {
        return this.http.post<void>(this.routeConstrutech('planillaUsuario/delete'), body);
    }


    //BUSCA USUARIOS
    public getUsuarios = (body: FiltroDTO): Observable<ResponseDTO<PaginadoDTO<UsuarioDTO>>> => {
        return this.http.post<ResponseDTO<PaginadoDTO<UsuarioDTO>>>(this.routeConstrutech('usuario/v1.0/find'), body, this.generateHeaders());
    }

    public getUsuariosv2 = (): Observable<ResponseDTO<UsuarioDTO[]>> => {
        return this.http.get<ResponseDTO<UsuarioDTO[]>>(this.routeConstrutech('usuario/v2.0/find'), this.generateHeaders());
    }

    //BUSCA PERSONA POR DOCUMENTO
    public getPersonaPorDoc = (body: PersonaRequestDTO): Observable<ResponseDTO<PersonaDTO>> => {
        return this.http.post<ResponseDTO<PersonaDTO>>(this.routeConstrutech('persona/v1.0/find/personaDoc'), body, this.generateHeaders());
    }

    public createUsuario = (body: UsuarioRequestDTO): Observable<ResponseDTO<UsuarioDTO>> => {
        return this.http.post<ResponseDTO<UsuarioDTO>>(this.routeConstrutech('usuario/v1.0/create'), body, this.generateHeaders());
    }

    public editUsuario = (body: UsuarioRequestDTO) : Observable<ResponseDTO<UsuarioDTO>> => {
        return this.http.post<ResponseDTO<UsuarioDTO>>(this.routeConstrutech('usuario/v1.0/edit'), body, this.generateHeaders());
    }
    
    public deleteUsuario = (id: number): Observable<ResponseDTO<UsuarioDTO>> => {       
        return this.http.post<ResponseDTO<UsuarioDTO>>(this.routeConstrutech('usuario/v1.0/delete'), id, this.generateHeaders());
    } 

    public getUsuarioById = (id: number): Observable<ResponseDTO<UsuarioDTO>> => {
        return this.http.post<ResponseDTO<UsuarioDTO>>(this.routeConstrutech('usuario/v1.0/findById'), id, this.generateHeaders());
    }

    //TipoDocumentos
    public getTipoDocumentos = (): Observable<ResponseDTO<TipoDocumento[]>> => {
        return this.http.get<ResponseDTO<TipoDocumento[]>>(this.routeConstrutech('tipoDocumento/v1.0/find'), this.generateHeaders());
    }

    //PERFILES
    public getPerfiles = (): Observable<ResponseDTO<PerfilDTO[]>> => {
        return this.http.get<ResponseDTO<PerfilDTO[]>>(this.routeConstrutech('perfil/v1.0/find'), this.generateHeaders());
    }

    //ESTADOS
    public getEstados = (): Observable<ResponseDTO<Estado[]>> => {
        return this.http.post<ResponseDTO<Estado[]>>(this.routeConstrutech('estado/v1.0/find'), this.generateHeaders());
    }

    //GUARDADO DOTACION
    public saveDotacion = (body: DotacionDTO): Observable<ResponseDTO<void>> => {
        return this.http.post<ResponseDTO<void>>(this.routeConstrutech('dotacion/v1.0/crear'), body, this.generateHeaders());
    }

    public extraerMonto =(body: FiltroDTO): Observable<ResponseDTO<BigInteger>> => {
        return this.http.post<ResponseDTO<BigInteger>>(this.routeConstrutech('dotacion/v1.0/montos'), body, this.generateHeaders());
    }

    //INICIA RUTAS
    private routeConstrutech = (route: string) => {
        return `${environment.urlAddress}/${route}`;
    }

    //ENVIO DE EXCEL
    public envioExcel = (file: File): Observable<ResponseDTO<void>> => {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<ResponseDTO<void>>(this.routeConstrutech('asistencia/uploadFile'), formData);
    }

    public listPersonal = (body: FiltroDTO): Observable<ResponseDTO<personalAtraccionDTO[]>> => {
        return this.http.post<ResponseDTO<personalAtraccionDTO[]>>(this.routeConstrutech('persona/listPersonalAtraccion'), body);
    }

    public saveAtraccionT = (body: AtraccionTalentoDTO, induccArch: File, emoArch: File): Observable<any> => {
        const formData = new FormData();
        formData.append("atraccionT", new Blob([JSON.stringify(body)], { type: "application/json" }));

        if (induccArch) {
            formData.append("techAtracInduccionArch", induccArch);
        }

        if (emoArch) {
            formData.append("techAtracEmoArch", emoArch);
        }

        return this.http.post<any>(this.routeConstrutech('atraccion/save'), formData);
    }



    public listAtraccion = (body: FiltroDTO): Observable<ResponseDTO<void>> => {
        return this.http.post<any>(this.routeConstrutech('atraccion/list'), body, this.generateHeaders());
    }

    public listPlanillas = (): Observable<any> => {
        return this.http.get<any>(this.routeConstrutech('atraccion/listPlanillas'))
    }

    public listProoyectos(planId: number): Observable<any> {
        const url = `atraccion/listProyectos/${planId}`;
        return this.http.post<any>(this.routeConstrutech(url), null)
    }

    public listUnidGestion = (body: FiltroDTO): Observable<any> => {
        return this.http.post<any>(this.routeConstrutech('atraccion/listUnidadGestion'), body);
    }

    public listCentC = (body: FiltroDTO): Observable<any> => {
        return this.http.post<any>(this.routeConstrutech('atraccion/listCentroC'), body);
    }

    public listCargos = (body: FiltroDTO): Observable<any> => {
        return this.http.post<any>(this.routeConstrutech('atraccion/listCargos'), body);
    }

    public saveAsistencia(body: FiltroDTO): Observable<any> {
        // console.log("dni:", dni);
        // const body = new URLSearchParams();
        // body.set('dni', dni);   
        // console.log(body.toString());
        const url = `asistencia/save`;

        return this.http.post<any>(this.routeConstrutech(url), body, this.generateHeaders());
    }

    public listSueldo(planId: number): Observable<String> {
        const url = `atraccion/listSueldo/${planId}`;
        return this.http.post<String>(this.routeConstrutech(url), null, this.generateHeaders())
    }

    public listMarcaciones = (body: FiltroDTO): Observable<any> => {
        return this.http.post<any>(this.routeConstrutech('asistencia/listMarcaciones'), body, this.generateHeaders())
    }

    public buscarMarcaciones(termino: string): Observable<any> {
        return this.http.post<any>(this.routeConstrutech('asistencia/search'), termino, this.generateHeaders())
    }

    public listPersonCese = (body: FiltroDTO): Observable<any> => {
        return this.http.post<any>(this.routeConstrutech('atraccion/listPersonaCese'), body, this.generateHeaders());
    }

    public validateUserRoster = (body: FiltroDTO) : Observable<PlanillaUsuarioDTO> => {
        return this.http.post<PlanillaUsuarioDTO>(this.routeConstrutech('ruster/validarRoster'), body, this.generateHeaders())
    }

    public searchNotificaciones (id: number) : Observable<NotificacionDTO[]> {
        const url = `notificaciones/buscarNotificaciones?id=${id}`;
        return this.http.post<NotificacionDTO[]>(this.routeConstrutech(url), null)
    }

    public buscarIdsDotacion (id: number) : Observable<ResponseDTO<DotacionDTO>>{
        const url = `dotacion/buscarIdDotacion?id=${id}`;
        return this.http.post<ResponseDTO<DotacionDTO>>(this.routeConstrutech(url), null);
    }

    enviarPlanillaRoster(planilla: any) {
        this.planillaRoster = planilla;
    }

    recibirPlanillaRoster() {
        return this.planillaRoster;
    }
    

    public getAprobadores = (empresaId: number): Observable<ResponseDTO<AprobadorDTO[]>> => {
        return this.http.get<ResponseDTO<AprobadorDTO[]>>(this.routeConstrutech('dotacion/v1.0/aprobadores/' + empresaId));
    }

    //GENERADOR DE HEADERS
    private generateHeaders = () => {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem("token"),
                'Access-Control-Allow-Origin': 'https://deaorwhzisbsc.cloudfront.net'
            })
        }
    }

    // //GENERADOR DE HEADERS MULTIFORMDATA
    // private generateHeadersMultiForm = () => {
    //     return {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'multipart/form-data'
    //         })
    //     }
    // }
}