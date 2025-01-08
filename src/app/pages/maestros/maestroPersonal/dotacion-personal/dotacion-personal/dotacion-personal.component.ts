import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { ConstrutechService } from "src/app/shared/services/construtech.service";
import { UtilTools } from "src/app/shared/util/util-tools";
import Swal from "sweetalert2";
// import { ConsolidadopopComponent } from '../../crear-dotacion/consolidadopop/consolidadopop.component';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { CostospopComponent } from "./costospop/costospop.component";
import { FiltroDTO } from "src/app/shared/model/filtroDTO";
import { UnidadDTO } from "src/app/shared/model/database-dto/unidadDTO";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
// import { DotacionDetalleDTO } from 'src/app/shared/model/database-dto/dotacionDetalleDTO';
import { DotacionDTO } from "src/app/shared/model/database-dto/dotacionDTO";
// import * as moment from 'moment';
import { MasterDTO } from "src/app/shared/model/database-dto/masterDTO";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { PagoDetalleDTO } from "src/app/shared/model/database-dto/pagoDetalleDTO";
import { NgxSpinnerService } from "ngx-spinner";
import { EmpresaDTO } from "src/app/shared/model/database-dto/empresaDTO";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { SolicitudpopComponent } from "./solicitudpop/solicitudpop.component";
import { CurrencyPipe } from "@angular/common";
import { DashboardComponent } from "src/app/core/components/dashboard/dashboard.component";
import { ResponseDTO } from "src/app/shared/model/responseDTO";
import { HeaderComponent } from "src/app/core/components/header/header.component";

@Component({
  selector: "app-dotacion-personal",
  templateUrl: "./dotacion-personal.component.html",
  styleUrls: ["./dotacion-personal.component.css"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class DotacionPersonalComponent implements OnInit {
  dummySolicitudes = [
    {
      codigo: "SOL-RAU-001",
      motivo: "Solicitud Inicial",
      cantidadPersonal: 60,
      movil: 7500,
      efectivo: 7500,
      concepto: 7500,
      fechaCreacion: "2023-05-04",
      estado: "Aprobado",
    },
    {
      codigo: "SOL-RAU-002",
      motivo: "Solicitud Inicial",
      cantidadPersonal: 80,
      movil: 8500,
      efectivo: 8500,
      concepto: 8500,
      fechaCreacion: "2023-05-05",
      estado: "Rechazado",
    },
    {
      codigo: "SOL-RAU-003",
      motivo: "Solicitud Inicial",
      cantidadPersonal: 40,
      movil: 4500,
      efectivo: 4500,
      concepto: 4500,
      fechaCreacion: "2023-05-06",
      estado: "Aprobado",
    },
    {
      codigo: "SOL-RAU-004",
      motivo: "Solicitud Inicial",
      cantidadPersonal: 10,
      movil: 1500,
      efectivo: 1500,
      concepto: 1500,
      fechaCreacion: "2023-05-07",
      estado: "Rechazado",
    },
    {
      codigo: "SOL-RAU-005",
      motivo: "Solicitud Inicial",
      cantidadPersonal: 30,
      movil: 5500,
      efectivo: 5500,
      concepto: 5500,
      fechaCreacion: "2023-05-08",
      estado: "Aprobado",
    },
    {
      codigo: "SOL-RAU-006",
      motivo: "Solicitud Inicial",
      cantidadPersonal: 20,
      movil: 2500,
      efectivo: 2500,
      concepto: 2500,
      fechaCreacion: "2023-05-09",
      estado: "Rechazado",
    },
  ];

  vistaMasterPersonal: boolean = true;
  vistaSolicitudes: boolean = false;
  vistaConsolidado: boolean = false;
  vistaNuevoMaster: boolean = false;

  dataMasterPersonal: boolean = false;
  dataNuevaDotacion: boolean = true;
  dataSolicitudes: boolean = false;
  dataConsolidado: boolean = false;
  dataConsolidadoDetalle: boolean = false;

  filtro: FiltroDTO;

  masterList = [];
  consolidadoList = [];
  solicitudes = [];
  // nuevaDotacion: DotacionDetalleDTO[] = []

  empresaConsolidado: number;
  proyectoConsolidado: number;

  //Master Personal
  filtroMasterPersonal: FormGroup;
  columnsMasterPersonal: string[] = [
    "empresa",
    "uproyecto",
    "jefeoperaciones",
    "cantPersDot",
    "cantPersReal",
    "movil",
    "efectivo",
    "concepto",
    "fechaCreacion",
    "solicitudPendiente",
    "solicitud",
    "consolidado",
  ];
  masterPersonalDataSource = new MatTableDataSource<MasterDTO>();
  columnsMasterPersonalWithExpand = [...this.columnsMasterPersonal, "expand"];
  expandedElement2: DotacionDTO | null;
  @ViewChild(MatPaginator, { static: true }) paginatorMaster: MatPaginator;
  pageSizeOptionsMaster = [5, 10, 15];
  pageSizeMaster: number = 10;
  pageNumberMaster: number = 0;
  lengthMaster: number;

  //Solicitudes
  filtroSolicitudes: FormGroup;
  detalleSolicitudGroup: FormGroup;
  solicitudesDataSource = new MatTableDataSource<any>();
  columnsSolicitudes: string[] = [
    "position",
    "codigo",
    "motivo",
    "cantidadPersonal",
    "movil",
    "efectivo",
    "concepto",
    "fechaCreacion",
    "estado",
    "detalle",
  ];
  @ViewChild(MatPaginator, { static: true }) paginatorSolicitudes: MatPaginator;
  pageSizeOptionsSolicitudes = [5, 10, 15];
  pageSizeSolicitudes: number = 10;
  pageNumberSolicitudes: number = 0;
  lengthSolicitudes: number;
  flagRechazoDetalle: boolean = false;
  mensajeRechazo: string = "";

  //Consolidado
  consolidadoDataSource = new MatTableDataSource<MasterDTO>();
  columnsConsolidado: string[] = [
    "planDesc",
    "zonDesc",
    "tctoDesc",
    "ugesDesc",
    "ccosDesc",
    "cargDesc",
    "cantPerDotacion",
    "montMovProv",
    "montEfect",
    "montTot",
  ];
  @ViewChild(MatPaginator, { static: true }) paginatorConsolidado: MatPaginator;
  pageSizeOptionsConsolidado = [5, 10, 15];
  pageSizeConsolidado: number = 10;
  pageNumberConsolidado: number = 0;
  lengthConsolidado: number;
  tituloDetalleConsolidado = "Consolidado";

  //Nueva Dotacion
  filtroNuevaDotacion: FormGroup;
  // columnsNuevaDotacion: string[] = ['position', 'planilla', 'ugestion', 'tipoContrato', 'centroCosto', 'zona', 'cargo',
  //   'cantidad', 'movil', 'efectivo', 'concepto', 'editar', 'eliminar'];
  // nuevaDotacionDataSource = new MatTableDataSource<any>();
  empresas = [];
  listaUnidadProyectos: UnidadDTO[];
  // listaEmpresas:EmpresaDTO[]
  //
  columnsConsolidadoDetalle: string[] = [
    "planDesc",
    "zonDesc",
    "tctoDesc",
    "ugesDesc",
    "ccosDesc",
    "cargDesc",
    "cantPerDotacion",
    "montMovProv",
    "montEfect",
    "montTot",
    "Detalle",
  ];
  dataSourceConsolidadoDetalle = new MatTableDataSource<any>();
  operacionSolicitud: number;
  flagVista: number;
  dotacionId: number;

  filteredObjetos: EmpresaDTO[] = [];
  searchTerm: string = "";
  filteredObjetos2: UnidadDTO[] = [];
  searchTerm2: string = "";
  selectedEmpsId = -1;
  selectedUnidId = -1;

  valorProgressBar: number;

  constructor(
    private utils: UtilTools,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private construtechService: ConstrutechService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private currencyPipe: CurrencyPipe
  ) {}

  expandedElement: MasterDTO | null;

  filaExpandida(expandedElement: MasterDTO) {
    console.log(expandedElement);
    if (expandedElement !== null && expandedElement !== undefined) {
      this.filtro = new FiltroDTO();

      if (this.flagVista === 1) {
        this.filtro.filterEmpId = this.empresaConsolidado;
        this.filtro.filterUproId = this.proyectoConsolidado;
      } else if (this.flagVista === 2) {
        this.filtro.filterDotId = this.dotacionId;
      }

      this.filtro.filterPlanId = expandedElement.planId;
      this.filtro.filterZonId = expandedElement.zonId;
      this.filtro.filterTctoId = expandedElement.tctoId;
      this.filtro.filterUgesId = expandedElement.ugesId;
      this.filtro.filterCcosId = expandedElement.ccosId;
      this.filtro.filterCargId = expandedElement.cargId;
      this.filtro.pageNumber = 0;
      this.filtro.pageSize = 1000;

      if (this.flagVista === 1) {
        this.construtechService.getConsolidadoDetalle(this.filtro).subscribe(
          (res) => {
            if (res.codigo === 1000) {
              this.dataSourceConsolidadoDetalle = new MatTableDataSource<any>(
                res.data.content
              );
              this.dataConsolidadoDetalle = true;
            } else {
              this.alert("error", "Detalle Consolidado", res.mensaje);
              this.dataConsolidadoDetalle = false;
            }
          },
          (err) => {
            console.log(JSON.stringify(err));
            this.dataConsolidadoDetalle = false;
          }
        );
      } else if (this.flagVista === 2) {
        this.construtechService
          .getSolicitudesDetallesDetalles(this.filtro)
          .subscribe(
            (res) => {
              if (res.codigo === 1000) {
                this.dataSourceConsolidadoDetalle = new MatTableDataSource<any>(
                  res.data.content
                );
                this.dataConsolidadoDetalle = true;
              } else {
                this.alert("error", "Detalle Consolidado", res.mensaje);
                this.dataConsolidadoDetalle = false;
              }
            },
            (err) => {
              console.log(JSON.stringify(err));
              this.dataConsolidadoDetalle = false;
            }
          );
      }
    } else {
      this.dataConsolidadoDetalle = false;
    }
  }

  ngOnInit() {
    this.filtroMasterPersonal = this.formBuilder.group({
      uproyecto: new FormControl(-1),
      empresa: new FormControl(-1),
      //start: new FormControl(new Date()),
      //end: new FormControl(new Date()),
    });

    this.filtroSolicitudes = this.formBuilder.group({
      start: new FormControl(new Date()),
      end: new FormControl(new Date()),
    });

    // this.filtroNuevaDotacion = this.formBuilder.group({
    //   uproyecto: new FormControl(-1),
    //   empresa: new FormControl(-1),
    //   personas: new FormControl({ value: 0, disabled: true }),
    // })

    this.detalleSolicitudGroup = this.formBuilder.group({
      rechazo: new FormControl(""),
    });

    //Permiso para Aprobar y Rechazar Solicitud
    //rteif (sessionStorage.getItem("perfil") === 'ADMINISTRADOR' || sessionStorage.getItem("perfil") === 'RRHH') {
    //rte this.columnsSolicitudes.push('aprobacion');
    //rte}

    //rtethis.getEmpresas();
    //rtethis.getUproyecto();
    //rtethis.filtrarTablaMasterPersonal();

    //rtethis.validarSiEsRedireccion();
  }

  dirigirConsolidado(empresa: number, proyecto: number, operacion: number) {
    this.vistaMasterPersonal = false;
    this.vistaSolicitudes = false;
    this.vistaConsolidado = true;
    this.vistaNuevoMaster = false;
    this.flagRechazoDetalle = false;

    this.flagVista = 1;

    this.detalleSolicitudGroup.controls["rechazo"].setValue("");
    this.tituloDetalleConsolidado = "Consolidado";
    this.filtrarTablaConsolidado(empresa, proyecto, operacion, this.flagVista);
  }

  dirigirNuevoMaster() {
    this.vistaMasterPersonal = false;
    this.vistaSolicitudes = false;
    this.vistaConsolidado = false;
    this.vistaNuevoMaster = true;
  }

  dirigirSolicitudes(empresa: number, proyecto: number, operacion: number) {
    this.vistaMasterPersonal = false;
    this.vistaSolicitudes = true;
    this.vistaNuevoMaster = false;
    this.vistaConsolidado = false;

    this.empresaConsolidado = empresa;
    this.proyectoConsolidado = proyecto;
    this.operacionSolicitud = operacion;

    this.filtrarTablaSolicitudInicial();
  }

  validarSiEsRedireccion() {
    if (sessionStorage.getItem("dotacion")) {
      this.construtechService
        .buscarIdsDotacion(Number(sessionStorage.getItem("dotacion")))
        .subscribe((resp: ResponseDTO<DotacionDTO>) => {
          console.log(resp);
          if (resp.data.empId && resp.data.uproId) {
            this.dirigirSolicitudes(resp.data.empId, resp.data.uproId, 1);
            sessionStorage.removeItem("dotacion");
          } else {
            console.log("No se pudo rediregir a la solicitud");
          }
        });
    } else {
      console.log("No se encontro dotacion");
    }
  }

  regresarMaster() {
    this.vistaMasterPersonal = true;
    this.vistaSolicitudes = false;
    this.vistaNuevoMaster = false;
    this.vistaConsolidado = false;

    this.consolidadoDataSource = new MatTableDataSource<MasterDTO>();
    this.pageNumberConsolidado = 0;
    this.pageSizeConsolidado = 10;
    this.lengthConsolidado = 0;
    this.consolidadoDataSource.paginator = null;

    this.solicitudesDataSource = new MatTableDataSource<MasterDTO>();
    this.pageNumberSolicitudes = 0;
    this.pageSizeSolicitudes = 10;
    this.lengthSolicitudes = 0;
    this.solicitudesDataSource.paginator = null;

    this.dataConsolidado = false;
    this.dataSolicitudes = false;
  }

  filtrarTablaMasterPersonal() {
    this.spinner.show();
    this.filtro = new FiltroDTO();
    this.filtro.filterEmpId = this.selectedEmpsId;
    this.filtro.filterUproId = this.selectedUnidId;
    //this.filtro.filterFecIni = this.datePipe.transform(this.filtroMasterPersonal.controls['start'].value, 'MM-dd-yyyy');
    //this.filtro.filterFecFin = this.datePipe.transform(this.filtroMasterPersonal.controls['end'].value, 'MM-dd-yyyy');
    this.filtro.pageNumber = this.pageNumberMaster;
    this.filtro.pageSize = this.pageSizeMaster;

    this.construtechService.getMaster(this.filtro).subscribe((res) => {
      this.spinner.hide();
      if (res.codigo === 1000) {
        console.log(res.data);
        if (res.data.content.length == 0) this.dataMasterPersonal = false;
        else this.dataMasterPersonal = true;
        this.masterPersonalDataSource = new MatTableDataSource<MasterDTO>(
          res.data.content
        );
        this.masterPersonalDataSource.paginator = this.paginatorMaster;
        this.lengthMaster = res.data.totalElements;
      } else {
        this.dataMasterPersonal = false;
        this.masterPersonalDataSource = null;
        this.alert("info", "Dotacion", res.mensaje);
      }
    });
  }

  crearSolicitud() {
    this.vistaMasterPersonal = false;
    this.vistaSolicitudes = false;
    this.vistaConsolidado = false;
    this.vistaNuevoMaster = true;

    this.filtroNuevaDotacion.controls["empresa"].setValue(
      this.empresaConsolidado
    );
    this.filtroNuevaDotacion.controls["empresa"].disable();
    this.filtroNuevaDotacion.controls["uproyecto"].setValue(
      this.proyectoConsolidado
    );
    this.filtroNuevaDotacion.controls["uproyecto"].disable();
  }

  filtrarTablaSolicitud() {
    console.log("Entra Buscar2");

    this.filtro = new FiltroDTO();
    this.filtro.filterEmpId = this.empresaConsolidado;
    this.filtro.filterUproId = this.proyectoConsolidado;
    this.filtro.filterFecIni = this.datePipe.transform(
      this.filtroSolicitudes.controls["start"].value,
      "MM-dd-yyyy"
    );
    this.filtro.filterFecFin = this.datePipe.transform(
      this.filtroSolicitudes.controls["end"].value,
      "MM-dd-yyyy"
    );

    if (this.operacionSolicitud === 1) {
      this.filtro.pageNumber = 0;
      this.filtro.pageSize = 10;
      this.lengthSolicitudes = 0;
    } else {
      this.filtro.pageNumber = this.pageNumberSolicitudes;
      this.filtro.pageSize = this.pageSizeSolicitudes;
    }
    console.log(this.filtro);
    this.construtechService.getSolicitudes(this.filtro).subscribe((res) => {
      if (res.codigo === 1000) {
        console.log(res.data.content.length == 0);
        if (res.data.content.length == 0) this.dataSolicitudes = false;
        else this.dataSolicitudes = true;

        this.solicitudesDataSource = new MatTableDataSource<MasterDTO>(
          res.data.content
        );
        this.solicitudesDataSource.paginator = this.paginatorSolicitudes;
        this.lengthSolicitudes = res.data.totalElements;
      } else {
        this.dataSolicitudes = false;
        this.solicitudesDataSource = new MatTableDataSource<MasterDTO>();
        this.pageNumberSolicitudes = 0;
        this.pageSizeSolicitudes = 10;
        this.lengthSolicitudes = 0;
        this.solicitudesDataSource.paginator = null;
        this.alert("info", "Solicitudes", res.mensaje);
      }
    });
  }

  filtrarTablaSolicitudInicial() {
    this.spinner.show();
    console.log("Entra Buscar");
    this.filtro = new FiltroDTO();
    this.filtro.filterEmpId = this.empresaConsolidado;
    this.filtro.filterUproId = this.proyectoConsolidado;
    this.filtro.filterFecIni = null;
    this.filtro.filterFecFin = null;

    if (this.operacionSolicitud === 1) {
      this.filtro.pageNumber = 0;
      this.filtro.pageSize = 10;
      this.lengthSolicitudes = 0;
    } else {
      this.filtro.pageNumber = this.pageNumberSolicitudes;
      this.filtro.pageSize = this.pageSizeSolicitudes;
    }
    console.log(this.filtro);
    this.construtechService.getSolicitudes(this.filtro).subscribe((res) => {
      this.spinner.hide();
      if (res.codigo === 1000) {
        console.log(res.data.content);
        console.log(res.data.content.length == 0);
        if (res.data.content.length == 0) this.dataSolicitudes = false;
        else this.dataSolicitudes = true;

        this.solicitudesDataSource = new MatTableDataSource<MasterDTO>(
          res.data.content
        );
        this.solicitudesDataSource.paginator = this.paginatorSolicitudes;
        this.lengthSolicitudes = res.data.totalElements;

        this.operacionSolicitud = 0;
      } else {
        this.dataSolicitudes = false;
        this.solicitudesDataSource = new MatTableDataSource<MasterDTO>();
        this.pageNumberSolicitudes = 0;
        this.pageSizeSolicitudes = 10;
        this.lengthSolicitudes = 0;
        this.solicitudesDataSource.paginator = null;
        this.alert("info", "Solicitudes", res.mensaje);
      }
    });
  }

  //CONSOLIDADO -> view = 1
  //SOLICITUDES -> view = 2
  filtrarTablaConsolidado(
    empresa: number,
    proyecto: number,
    operacion: number,
    view: number
  ) {
    this.empresaConsolidado = empresa;
    this.proyectoConsolidado = proyecto;

    console.log("Entra Buscar");
    this.filtro = new FiltroDTO();
    if (this.flagVista === 1) {
      this.filtro.filterEmpId = this.empresaConsolidado;
      this.filtro.filterUproId = this.proyectoConsolidado;
    } else {
      this.filtro.filterDotId = this.dotacionId;
    }

    if (operacion === 1) {
      this.filtro.pageNumber = 0;
      this.filtro.pageSize = 10;
      this.lengthConsolidado = 0;
    } else {
      this.filtro.pageNumber = this.pageNumberConsolidado;
      this.filtro.pageSize = this.pageSizeConsolidado;
    }

    console.log(JSON.stringify(this.filtro));

    if (this.flagVista === 1) {
      this.construtechService.getConsolidado(this.filtro).subscribe((res) => {
        if (res.codigo === 1000) {
          console.log(res.data.content.length == 0);
          if (res.data.content.length == 0) this.dataConsolidado = false;
          else this.dataConsolidado = true;

          this.consolidadoDataSource = new MatTableDataSource<MasterDTO>(
            res.data.content
          );
          this.consolidadoDataSource.paginator = this.paginatorConsolidado;
          this.lengthConsolidado = res.data.totalElements;
        } else {
          this.dataConsolidado = false;
          this.consolidadoDataSource = new MatTableDataSource<MasterDTO>();
          this.pageNumberConsolidado = 0;
          this.pageSizeConsolidado = 10;
          this.lengthConsolidado = 0;
          this.consolidadoDataSource.paginator = null;
          this.alert("info", "Dotacion Consolidado", res.mensaje);
        }
      });
    } else {
      this.construtechService
        .getSolicitudesDetalles(this.filtro)
        .subscribe((res) => {
          if (res.codigo === 1000) {
            console.log(res.data.content.length == 0);
            if (res.data.content.length == 0) this.dataConsolidado = false;
            else this.dataConsolidado = true;

            this.consolidadoDataSource = new MatTableDataSource<MasterDTO>(
              res.data.content
            );
            this.consolidadoDataSource.paginator = this.paginatorConsolidado;
            this.lengthConsolidado = res.data.totalElements;
          } else {
            this.dataConsolidado = false;
            this.consolidadoDataSource = new MatTableDataSource<MasterDTO>();
            this.pageNumberConsolidado = 0;
            this.pageSizeConsolidado = 10;
            this.lengthConsolidado = 0;
            this.consolidadoDataSource.paginator = null;
            this.alert("info", "Dotacion Consolidado", res.mensaje);
          }
        });
    }
  }

  dirigirDetalleSolicitud(
    estado: any,
    mensaje: string,
    op: number,
    dotacionId: number
  ) {
    this.vistaMasterPersonal = false;
    this.vistaSolicitudes = false;
    this.vistaConsolidado = true;
    this.vistaNuevoMaster = false;

    this.tituloDetalleConsolidado = "Detalle";

    this.flagVista = 2; //SOLICITUDES
    this.dotacionId = dotacionId;

    if (estado == "RECHAZADO") {
      this.flagRechazoDetalle = true;
      this.detalleSolicitudGroup.controls["rechazo"].setValue(
        mensaje.split(",")[1]
      );
    } else {
      this.flagRechazoDetalle = false;
      this.detalleSolicitudGroup.controls["rechazo"].setValue("");
    }

    this.filtrarTablaConsolidado(
      this.empresaConsolidado,
      this.proyectoConsolidado,
      op,
      this.flagVista
    );
  }

  aprobacionSolicitud(id: number, codigo: string) {
    Swal.fire({
      type: "info",
      title: "Aprobar Solicitud",
      text: "Selecciona la acción que desea realizar",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Rechazar",
      confirmButtonColor: this.translate.instant("alert.alert_button_color"),
      cancelButtonColor: this.translate.instant("alert.alert_button_color"),
      showLoaderOnConfirm: true,
      allowOutsideClick: true,
      focusCancel: true,
      preConfirm: (x) => {},
    }).then((response) => {
      let dotacion = new DotacionDTO();
      dotacion.id = id;
      dotacion.perfil = sessionStorage.getItem("perfil");
      dotacion.aproId = sessionStorage.getItem("usuarioid");

      if (response.value) {
        dotacion.estId = 2;
        this.callServiceAprobacion(
          dotacion,
          "La solicitud " + codigo + " ha sido aprobada correctamente"
        );
      } else {
        dotacion.estId = 3;

        Swal.fire({
          type: "info",
          title: "Rechazar Solicitud",
          text: "Ingrese el motivo de su rechazo",
          input: "text",

          showCancelButton: false,
          confirmButtonText: "Aceptar",
          confirmButtonColor: this.translate.instant(
            "alert.alert_button_color"
          ),
          showLoaderOnConfirm: true,
          allowOutsideClick: true,
          preConfirm: (x) => {
            console.log(x);
            dotacion.motivo = x;
            this.callServiceAprobacion(
              dotacion,
              "La solicitud " + codigo + " ha sido rechazada correctamente"
            );
          },
        });
      }
    });
  }

  callServiceAprobacion(dotacion: DotacionDTO, alert: string) {
    this.operacionSolicitud = 1;
    this.construtechService.aprobarSolicitud(dotacion).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.alert("info", "Aprobación de Solicitud", alert);
          this.filtrarTablaSolicitudInicial();
        } else {
          this.alert("info", "Aprobación de Solicitud", res.mensaje);
          this.filtrarTablaSolicitudInicial();
        }
      },
      (err) => {
        this.alert("info", "Aprobación de Solicitud", err.mensaje);
      }
    );
  }

  mostrarDetalleCostos(id: number) {
    let costosIniciales: PagoDetalleDTO[] = [];
    let costosCalculados: PagoDetalleDTO[] = [];

    this.filtro = new FiltroDTO();
    this.filtro.filterIds = [id];
    this.filtro.pageNumber = 0;
    this.filtro.pageSize = 1000;

    this.construtechService.getPagos(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          res.data.content.forEach((x) => {
            let item: PagoDetalleDTO = new PagoDetalleDTO();
            item.conpId = x.conpId;
            item.conpDesc = x.conpDesc;
            item.montTot = x.montTot;
            if (
              x.conpId === 1 ||
              x.conpId === 13 ||
              x.conpId === 121 ||
              x.conpId === 122 ||
              x.conpId === 41 ||
              x.conpId === 120
            ) {
              costosIniciales.push(item);
            } else {
              costosCalculados.push(item);
            }
          });

          let dataEnviada = {
            costos: costosIniciales,
            detalleCostos: costosCalculados,
          };
          let dialogRef = this.dialog.open(CostospopComponent, {
            height: "fit-content",
            width: "800px",
            autoFocus: false,
            disableClose: true,
            data: dataEnviada,
          });
        } else {
          this.alert("error", "Detalle de Pagos", res.mensaje);
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  // addConsolidado() {
  //   let empresaId = this.filtroNuevaDotacion.controls['empresa'].value
  //   let uproyectoId = this.filtroNuevaDotacion.controls['uproyecto'].value
  //   if (empresaId === -1) {
  //     this.alert(
  //       'info',
  //       'Dotacion Personal',
  //       'Debe seleccionar la empresa para la cual desea crear una nueva dotacion de personal');
  //   } else {
  //     let dialogRef = this.dialog.open(ConsolidadopopComponent, {
  //       height: "fit-content",
  //       autoFocus: false,
  //       disableClose: true,
  //       data: { empresaId: empresaId, uproyectoId: uproyectoId  },
  //     });

  //     dialogRef.afterClosed().subscribe(res => {
  //       console.log(res);

  //       if (res !== null || res !== undefined) {

  //         this.filtroNuevaDotacion.controls['empresa'].disable()
  //         this.filtroNuevaDotacion.controls['uproyecto'].disable()

  //         let cantidadPersonas = this.filtroNuevaDotacion.controls['personas'].value
  //         this.filtroNuevaDotacion.controls['personas'].setValue(cantidadPersonas + res.cant)

  //         this.nuevaDotacion.push(res)
  //         this.nuevaDotacionDataSource = new MatTableDataSource(this.nuevaDotacion)
  //       }
  //     })
  //   }
  // }

  // modificarNuevaDotacion(element: DotacionDetalleDTO, i: number) {
  //   let empresaId = this.filtroNuevaDotacion.controls['empresa'].value
  //   let dialogRef = this.dialog.open(ConsolidadopopComponent, {
  //     height: "fit-content",
  //     autoFocus: false,
  //     disableClose: true,
  //     data: { empresaId: empresaId, dotacionDetalleOld: element }
  //   });

  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res !== null || res !== undefined) {
  //       let cantidadPersonas = this.filtroNuevaDotacion.controls['personas'].value
  //       this.filtroNuevaDotacion.controls['personas'].setValue(cantidadPersonas + res.cant - element.cant)

  //       this.nuevaDotacion[i] = res

  //       this.nuevaDotacionDataSource = new MatTableDataSource(this.nuevaDotacion)
  //     }
  //   })
  // }

  // eliminarNuevaDotacion(element: DotacionDetalleDTO, i: number) {

  //   let cantidadPersonas = this.filtroNuevaDotacion.controls['personas'].value
  //   this.filtroNuevaDotacion.controls['personas'].setValue(cantidadPersonas - element.cant)

  //   this.nuevaDotacion.splice(i, 1)

  //   if (this.nuevaDotacion.length >= 1) {
  //     this.nuevaDotacionDataSource = new MatTableDataSource(this.nuevaDotacion)
  //   } else {
  //     this.nuevaDotacionDataSource = new MatTableDataSource<any>();
  //     this.filtroNuevaDotacion.controls['empresa'].enable()
  //     this.filtroNuevaDotacion.controls['uproyecto'].enable()
  //   }
  // }

  public alert(type: any, title: any, error: string) {
    Swal.fire({
      type: type,
      title: title,
      html: error,
      confirmButtonColor: this.translate.instant("alert.alert_button_color"),
    });
  }

  public pageChangedMaster(event?: PageEvent) {
    this.pageNumberMaster = event.pageIndex;
    this.pageSizeMaster = event.pageSize;
    this.lengthMaster = event.length;
    this.filtrarTablaMasterPersonal();
  }

  public pageChangedSolicitudes(event?: PageEvent) {
    this.pageNumberSolicitudes = event.pageIndex;
    this.pageSizeSolicitudes = event.pageSize;
    this.lengthSolicitudes = event.length;
    this.filtrarTablaSolicitudInicial();
  }

  public pageChangedConsolidado(event?: PageEvent) {
    this.pageNumberConsolidado = event.pageIndex;
    this.pageSizeConsolidado = event.pageSize;
    this.lengthConsolidado = event.length;
    this.filtrarTablaConsolidado(
      this.empresaConsolidado,
      this.proyectoConsolidado,
      2,
      this.flagVista
    );
  }

  public getEmpresas() {
    this.construtechService.getEmpresas().subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.empresas = res.data;
          this.filteredObjetos = res.data;
        } else {
          this.alert("error", "Filtros", res.mensaje);
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  public getUproyecto() {
    this.filtro = new FiltroDTO();
    this.filtro.filterEmpId =
      this.filtroMasterPersonal.controls["empresa"].value;

    this.construtechService.getUproyectoV2("", this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.listaUnidadProyectos = res.data;
          this.filteredObjetos2 = res.data;
        } else {
          this.alert("error", "Filtros", res.mensaje);
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  public getUproyecto3(event: MatAutocompleteSelectedEvent) {
    this.selectedEmpsId = event.option.value;
    const selectedEmpsId = event.option.value;
    const selectedObjeto = this.filteredObjetos.find(
      (objeto) => objeto.empsId === selectedEmpsId
    );
    if (selectedObjeto) {
      this.searchTerm = selectedObjeto.empsAlias;
    }

    this.filtro = new FiltroDTO();
    this.filtro.filterEmpId = this.selectedEmpsId;
    this.construtechService.getUproyectoV2("", this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.listaUnidadProyectos = res.data;
          this.filteredObjetos2 = res.data;
        } else {
          this.alert("error", "Filtros", res.mensaje);
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  //PARA TAB DE CREACION
  // public getUproyecto2() {
  //   this.filtro = new FiltroDTO()
  //   this.filtro.filterEmpId = this.filtroNuevaDotacion.controls['empresa'].value

  //   this.construtechService.getUproyectoV2("", this.filtro)
  //     .subscribe(
  //       res => {
  //         if (res.codigo === 1000) {
  //           this.listaUnidadProyectos = res.data
  //         } else {
  //           this.alert("error", "Filtros", res.mensaje)
  //         }
  //       },
  //       err => {
  //         console.log(JSON.stringify(err))
  //       }
  //     )
  // }

  // public guardarNuevaDotacion() {
  //   let dotacionDTO: DotacionDTO = new DotacionDTO()
  //   dotacionDTO.cod = this.filtroNuevaDotacion.controls['empresa'].value + '-' + this.filtroNuevaDotacion.controls['uproyecto'].value + '-00' + (moment(new Date())).format('YYYYMMDD')
  //   dotacionDTO.empId = this.filtroNuevaDotacion.controls['empresa'].value
  //   dotacionDTO.motivo = "Solicitud Inicial"
  //   dotacionDTO.uproId = this.filtroNuevaDotacion.controls['uproyecto'].value
  //   dotacionDTO.dotacionDetalles = this.nuevaDotacion

  //   console.log(JSON.stringify(dotacionDTO))

  //   Swal.fire({
  //     type: "info",
  //     title: "Guardar Nueva Dotacion",
  //     text: "¿Está seguro de guardar los cambios realizados?",
  //     inputAttributes: {
  //       autocapitalize: "off"
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: "Si, estoy seguro",
  //     cancelButtonText: "No, voy a verificar",
  //     confirmButtonColor: this.translate.instant('alert.alert_button_color'),
  //     cancelButtonColor: this.translate.instant('alert.alert_button_color'),
  //     showLoaderOnConfirm: true,
  //     allowOutsideClick: false,
  //     preConfirm: (x) => {
  //     }
  //   }).then(
  //     response => {
  //       if (response.value) {

  //         this.construtechService.saveDotacion(dotacionDTO).subscribe(
  //           res => {
  //             if (res.codigo === 1000) {
  //               this.utils.CloseTimer()
  //               Swal.fire({
  //                 type: "success",
  //                 title: "Nueva Dotacion",
  //                 html: res.mensaje,
  //                 confirmButtonColor: this.translate.instant("alert.alert_button_color")
  //               });
  //             } else {
  //               Swal.fire({
  //                 type: "info",
  //                 title: "Nueva Dotacion",
  //                 html: res.mensaje,
  //                 confirmButtonColor: this.translate.instant("alert.alert_button_color")
  //               });
  //             }
  //           },
  //           err => {
  //             Swal.fire({
  //               type: "error",
  //               title: "Nueva Dotacion",
  //               html: err.mensaje,
  //               confirmButtonColor: this.translate.instant("alert.alert_button_color")
  //             });
  //           }
  //         )
  //       }
  //     }
  //   )
  // }

  public filterOptions() {
    console.log(this.searchTerm);
    if (typeof this.searchTerm === "string" && this.searchTerm.trim() !== "") {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredObjetos = this.empresas.filter((objeto) =>
        objeto.empsAlias.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredObjetos = this.empresas;
    }
  }

  public filterOptions2() {
    console.log(this.searchTerm2);
    if (
      typeof this.searchTerm2 === "string" &&
      this.searchTerm2.trim() !== ""
    ) {
      const searchTermLower = this.searchTerm2.toLowerCase();
      this.filteredObjetos2 = this.listaUnidadProyectos.filter((objeto) =>
        objeto.unidNombre.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredObjetos2 = this.listaUnidadProyectos;
    }
  }

  public seleccionarUproyecto(event: MatAutocompleteSelectedEvent) {
    this.selectedUnidId = event.option.value;
    const selectedUnidId = event.option.value;
    const selectedObjeto = this.filteredObjetos2.find(
      (objeto) => objeto.unidId === selectedUnidId
    );
    if (selectedObjeto) {
      this.searchTerm2 = selectedObjeto.unidNombre;
    }
  }

  formateoNumeros(numero: number): string {
    let formattedValue = numero.toLocaleString("en-US");
    return formattedValue;
  }

  openModal() {
    this.dialog.open(DashboardComponent, {
      width: "120%",
      height: "95vh",
      data: "estructura",
    });
  }

  openDialog(dotacionId: number): void {
    const dialogRef = this.dialog.open(SolicitudpopComponent, {
      data: dotacionId,
    });
  }
}
