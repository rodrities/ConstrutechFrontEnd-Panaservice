import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { CargoDTO } from "src/app/shared/model/database-dto/cargoDTO";
import { EmpresaDTO } from "src/app/shared/model/database-dto/empresaDTO";
import { PlanillaDetalleDTO } from "src/app/shared/model/database-dto/planillaDetalleDTO";
import { PlanillaDTO } from "src/app/shared/model/database-dto/planillaDTO";
import { UnidadDTO } from "src/app/shared/model/database-dto/unidadDTO";
import { ConstrutechService } from "src/app/shared/services/construtech.service";
import Swal from "sweetalert2";
import { Persona } from "src/app/shared/model/database-entities/persona";
import { FiltroDTO } from "src/app/shared/model/filtroDTO";
import { Router } from "@angular/router";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { DatePipe } from "@angular/common";
import { UtilTools } from "src/app/shared/util/util-tools";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, of } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material/dialog";
import { DashboardComponent } from "src/app/core/components/dashboard/dashboard.component";

@Component({
  selector: "app-maestro-personal",
  templateUrl: "./maestroPersonal.component.html",
  styleUrls: ["./maestroPersonal.component.css"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class MaestroPersonalComponent implements OnInit {
  //STATE DE RETORNO DE VISTA DE ROSTER
  public state = "";

  //CONTROLADORES DE TABS
  vistaPlanilla: boolean = true;
  vistaPlanillaDetalle: boolean = false;
  vistaPersonal: boolean = false;

  //TABLA VISTA PLANILLAS
  filtroPlanilla: FormGroup;
  planillaDataSource = new MatTableDataSource<PlanillaDTO>();
  columnsPlanilla: string[] = [
    "planEmpDesc",
    "planDes",
    "planFeCrea",
    "detalle",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSizeOptions = [5, 10, 15];
  pageSize: number = 10;
  pageNumber: number = 0;
  length: number;

  //TABLA VISTA DETALLE PLANILLA
  filtroDetallePlanilla: FormGroup;
  planillaDetalleDataSource = new MatTableDataSource<PlanillaDetalleDTO>();
  columnsPlanillaDetalle: string[] = [
    "pdetUproDesc",
    "pdetUgesDesc",
    "pdetCcosDesc",
    "pdetCargDesc",
    "pdetCantPers",
    "detalle",
  ];
  @ViewChild(MatPaginator, { static: true }) paginatorDetail: MatPaginator;
  pageSizeOptionsDetail = [5, 10, 15];
  pageSizeDetail: number = 10;
  pageNumberDetail: number = 0;
  lengthDetail: number;

  //TABLA VISTA DETALLE PERSONAL
  personalDataSource = new MatTableDataSource<any>(); //CAMBIAR ANY AL CONSUMIR SERVICIO
  columnsPersonal: string[] = [
    "persTdocDesc",
    "persNuDoc",
    "persNombreComp",
    "persCategoria",
    "persCargo",
    "perFeIngreso",
    "perEdad",
    "perSexo",
    "perSede",
    "perCorreo",
    "persTelefono",
    "perDepartamento",
    "perProvincia",
    "perDistrito",
    "perDireccion",
  ];
  @ViewChild(MatPaginator, { static: true }) paginatorPersonal: MatPaginator;
  pageSizePersonal: number = 10;
  pageNumberPersonal: number = 0;
  lengthPersonal: number;

  //FILTROS

  //FILTRO VISTA PLANILLA
  empresas: EmpresaDTO[];

  //FILTRO VISTA PLANILLA DETALLE
  uproyectos: UnidadDTO[];
  ugestiones: UnidadDTO[];
  uccostos: UnidadDTO[];
  cargos: CargoDTO[];

  //FILTRO DTO
  filtro: FiltroDTO;
  planilla: number;
  planillaDetalle: number;
  planillaNombre: string;

  filteredObjetos: EmpresaDTO[] = [];
  searchTerm: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private construtechService: ConstrutechService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.state = window.history.state;
    console.log(this.state);

    if (this.state["vieneDeRoster"] == undefined) {
      // rte this.getEmpresas();
      // rte this.initForm();
    } else {
      this.vistaPlanillaDetalle = true;
      this.vistaPersonal = false;
      this.vistaPlanilla = false;

      this.filtroDetallePlanilla = this.formBuilder.group({
        uproyecto: new FormControl(-1),
        ugestion: new FormControl(-1),
        ccosto: new FormControl(-1),
        cargo: new FormControl(-1),
      });

      //rte this.planilla = this.state["planillaId"];

      this.filtroDetallePlanilla.controls["uproyecto"].setValue(
        this.state["unidadProyecto"]
      );
      this.filtroDetallePlanilla.controls["ugestion"].setValue(
        this.state["unidadGestion"]
      );
      this.filtroDetallePlanilla.controls["ccosto"].setValue(
        this.state["centroCosto"]
      );
      this.filtroDetallePlanilla.controls["cargo"].setValue(
        this.state["cargo"]
      );

      //rtethis.getAllData();

      this.filtroPlanilla = this.formBuilder.group({
        empresa: new FormControl(-1),
      });

      // rte this.filtroPlanilla.controls["empresa"].setValue(this.state["empsId"]);

      //rtethis.getPlanillaPorEmpresa();
    }
  }

  openModal() {
    this.dialog.open(DashboardComponent, {
      width: "120%",
      height: "95vh",
      data: "dotacion",
    });
  }

  /****************************** INI MAT TAB VISTA PLANILLA ******************************/
  public initForm() {
    this.filtroPlanilla = this.formBuilder.group({
      empresa: new FormControl(-1),
    });
    this.getPlanillas(null);
  }

  public getPlanillaPorEmpresa() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getPlanillas(null);
  }

  public getPlanillaPorEmpresaFiltered(event: MatAutocompleteSelectedEvent) {
    const selectedEmpsId = event.option.value;
    const selectedObjeto = this.filteredObjetos.find(
      (objeto) => objeto.empsId === selectedEmpsId
    );
    if (selectedObjeto) {
      this.searchTerm = selectedObjeto.empsAlias;
    }
    this.pageNumber = 0;
    this.pageSize = 10;
    console.log("Opción seleccionada:", event.option.value);
    this.getPlanillas(event.option.value);
  }

  public getPlanillas(empresaId: number) {
    this.spinner.show();
    this.filtro = new FiltroDTO();
    if (empresaId !== null) this.filtro.filterEmpId = empresaId;
    else
      this.filtro.filterEmpId = this.filtroPlanilla.controls["empresa"].value;
    //this.filtro.filterEmpId = this.auto.optionSelected
    this.filtro.pageNumber = this.pageNumber;
    this.filtro.pageSize = this.pageSize;
    this.construtechService.getPlanillas(this.filtro).subscribe((res) => {
      if (res.codigo === 1000) {
        this.planillaDataSource = new MatTableDataSource<PlanillaDTO>(
          res.data.content
        );
        this.planillaDataSource.paginator = this.paginator;
        this.length = res.data.totalElements;
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.planillaDataSource = null;
        this.alert("info", "Planillas", res.mensaje);
      }
    });
  }

  public getEmpresas() {
    this.construtechService.getEmpresas().subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.empresas = res.data;
          console.log(res.data);
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

  public limpiar() {
    this.filtroPlanilla.controls["empresa"].setValue(-1);
    this.planillaDataSource = new MatTableDataSource<PlanillaDTO>();
  }

  public pageChanged(event?: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length;
    this.getPlanillas(null);
  }

  public getDetalle(element: PlanillaDTO) {
    this.planilla = element.planId;
    this.planillaNombre = element.planDes;
    this.vistaPlanilla = false;
    this.vistaPlanillaDetalle = true;
    this.vistaPersonal = false;
    this.initTabDetalle();
  }
  /****************************** FIN MAT TAB VISTA PLANILLA ******************************/

  /************************** INI MAT TAB VISTA DETALLE PLANILLA **************************/
  public initTabDetalle() {
    this.initFormDetalle();
    this.getUproyecto();
    this.getUgestion();
    this.getCcosto();
    this.getCargos();
    this.getPlanillaDetalles();
  }

  public initFormDetalle() {
    this.filtroDetallePlanilla = this.formBuilder.group({
      uproyecto: new FormControl(-1),
      ugestion: new FormControl(-1),
      ccosto: new FormControl(-1),
      cargo: new FormControl(-1),
    });
  }

  public getUproyecto() {
    this.pageNumberDetail = 0;
    this.pageSizeDetail = 10;
    this.planillaDetalleDataSource.paginator = null;
    this.filtroDetallePlanilla.controls["uproyecto"].setValue(-1);
    this.filtroDetallePlanilla.controls["ugestion"].setValue(-1);
    this.filtroDetallePlanilla.controls["ccosto"].setValue(-1);
    this.filtroDetallePlanilla.controls["cargo"].setValue(-1);

    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.construtechService.getUproyecto(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.uproyectos = res.data;
          this.filtroDetallePlanilla.controls["uproyecto"].enable();
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  public getUgestion() {
    this.pageNumberDetail = 0;
    this.pageSizeDetail = 10;
    this.planillaDetalleDataSource.paginator = null;

    this.filtroDetallePlanilla.controls["ugestion"].setValue(-1);
    this.filtroDetallePlanilla.controls["ccosto"].setValue(-1);
    this.filtroDetallePlanilla.controls["ccosto"].setValue(-1);
    this.filtroDetallePlanilla.controls["cargo"].setValue(-1);

    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;
    this.construtechService.getUgestion(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.ugestiones = res.data;
          this.filtroDetallePlanilla.controls["ugestion"].enable();
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  public getCcosto() {
    this.pageNumberDetail = 0;
    this.pageSizeDetail = 10;
    this.planillaDetalleDataSource.paginator = null;
    this.filtroDetallePlanilla.controls["ccosto"].setValue(-1);
    this.filtroDetallePlanilla.controls["cargo"].setValue(-1);
    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;
    this.filtro.filterUgesId =
      this.filtroDetallePlanilla.controls["ugestion"].value;
    this.construtechService.getCcostos(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.uccostos = res.data;
          this.filtroDetallePlanilla.controls["ccosto"].enable();
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  public getCargos() {
    this.pageNumberDetail = 0;
    this.pageSizeDetail = 10;
    this.planillaDetalleDataSource.paginator = null;
    this.filtroDetallePlanilla.controls["cargo"].setValue(-1);
    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;
    this.filtro.filterUgesId =
      this.filtroDetallePlanilla.controls["ugestion"].value;
    this.filtro.filterCcosId =
      this.filtroDetallePlanilla.controls["ccosto"].value;
    this.construtechService.getCargos(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.cargos = res.data;
          this.filtroDetallePlanilla.controls["cargo"].enable();
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
  }

  public getPlanillaDetallesCargo() {
    this.pageNumber = 0;
    this.pageSize = 10;
    this.getPlanillaDetalles;
  }

  public getPlanillaDetalles() {
    this.filtro = new FiltroDTO();
    this.filtro.pageNumber = this.pageNumberDetail;
    this.filtro.pageSize = this.pageSizeDetail;
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;
    this.filtro.filterUgesId =
      this.filtroDetallePlanilla.controls["ugestion"].value;
    this.filtro.filterCcosId =
      this.filtroDetallePlanilla.controls["ccosto"].value;
    this.filtro.filterCargId =
      this.filtroDetallePlanilla.controls["cargo"].value;
    this.construtechService
      .getPlanillaDetalles(this.filtro)
      .subscribe((res) => {
        if (res.codigo === 1000) {
          this.planillaDetalleDataSource =
            new MatTableDataSource<PlanillaDetalleDTO>(res.data.content);
          this.planillaDetalleDataSource.paginator = this.paginatorDetail;
          this.lengthDetail = res.data.totalElements;
        } else {
          this.planillaDetalleDataSource =
            new MatTableDataSource<PlanillaDetalleDTO>();
          this.pageNumberDetail = 0;
          this.pageSizeDetail = 10;
          this.lengthDetail = 0;
          this.planillaDetalleDataSource.paginator = null;
          this.alert("info", "Detalle de Planilla", res.mensaje);
        }
      });
  }

  public pageChangedDetail(event?: PageEvent) {
    this.pageNumberDetail = event.pageIndex;
    this.pageSizeDetail = event.pageSize;
    this.lengthDetail = event.length;
    this.getPlanillaDetalles();
  }

  public limpiarDetallePlanilla() {
    this.initTabDetalle();
  }

  public regresar() {
    this.vistaPlanilla = true;
    this.vistaPlanillaDetalle = false;
    this.vistaPersonal = false;
  }

  public getPersonal(element: PlanillaDetalleDTO) {
    this.planillaDetalle = element.pdetId;
    this.vistaPlanilla = false;
    this.vistaPlanillaDetalle = false;
    this.vistaPersonal = true;
    this.initTabDetallePersonal();
  }

  public getAllData() {
    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    //TRAEMOS UPROYECTOS
    this.construtechService.getUproyecto(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.uproyectos = res.data;
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );

    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;

    //TRAEMOS UGESTION
    this.construtechService.getUgestion(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.ugestiones = res.data;
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );

    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;
    this.filtro.filterUgesId =
      this.filtroDetallePlanilla.controls["ugestion"].value;

    //TRAEMOS CCOSTO
    this.construtechService.getCcostos(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.uccostos = res.data;
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );

    this.filtro = new FiltroDTO();
    this.filtro.filterPlanId = this.planilla;

    this.filtro.filterUproId =
      this.filtroDetallePlanilla.controls["uproyecto"].value;
    this.filtro.filterUgesId =
      this.filtroDetallePlanilla.controls["ugestion"].value;
    this.filtro.filterCcosId =
      this.filtroDetallePlanilla.controls["ccosto"].value;

    //TRAEMOS CARGOS
    this.construtechService.getCargos(this.filtro).subscribe(
      (res) => {
        if (res.codigo === 1000) {
          this.cargos = res.data;
        }
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );

    this.getPlanillaDetalles();
  }

  /************************** FIN MAT TAB VISTA DETALLE PLANILLA **************************/

  /************************** INI MAT TAB VISTA DETALLE PERSONAL **************************/
  public initTabDetallePersonal() {
    this.filtro = new FiltroDTO();
    this.filtro.pageNumber = this.pageNumberPersonal;
    this.filtro.pageSize = this.pageSizePersonal;
    this.filtro.filterPdetId = this.planillaDetalle;
    this.construtechService
      .getPlanillaDetallePersonal(this.filtro)
      .subscribe((res) => {
        if (res.codigo === 1000) {
          res.data.content.forEach(function (value) {
            //Calculo de edad
            const convertAge = new Date(value.perFeNacimiento);
            const timeDiff = Math.abs(Date.now() - convertAge.getTime());
            value.perFeNacimiento = <any>(
              Math.floor(timeDiff / (1000 * 3600 * 24) / 365)
            );
            //Modificacion para el sexo de la persona
            if (value.perSexo == "0") {
              value.perSexo = "M";
            } else {
              value.perSexo = "F";
            }
          });
          this.personalDataSource = new MatTableDataSource<Persona>(
            res.data.content
          );
          this.personalDataSource.paginator = this.paginatorDetail;
          this.lengthPersonal = res.data.totalElements;
        } else {
          this.personalDataSource = new MatTableDataSource<Persona>();
          this.pageNumberPersonal = 0;
          this.pageSizePersonal = 10;
          this.lengthPersonal = 0;
          this.personalDataSource.paginator = null;
          this.alert("info", "Personal", res.mensaje);
        }
      });
  }

  public pageChangedPersonal(event?: PageEvent) {
    this.pageNumberPersonal = event.pageIndex;
    this.pageSizePersonal = event.pageSize;
    this.lengthPersonal = event.length;
    this.initTabDetallePersonal();
  }

  public regresarDetalle() {
    this.vistaPlanilla = false;
    this.vistaPlanillaDetalle = true;
    this.vistaPersonal = false;
    this.pageNumberPersonal = 0;
    this.pageSizePersonal = 10;
    this.lengthPersonal = 0;
  }

  /************************** FIN MAT TAB VISTA DETALLE PERSONAL **************************/
  public alert(type: any, title: any, error: string) {
    Swal.fire({
      type: type,
      title: title,
      html: error,
      confirmButtonColor: this.translate.instant("alert.alert_button_color"),
    });
  }

  public openDialog(uProyId: number) {
    if (uProyId == -1) {
      this.alert("info", "Roster", "Debe seleccionar una unidad de proyecto");
    } else {
      let uproyectoEscogido = this.uproyectos.find((x) => (x.unidId = uProyId));
      this.construtechService.enviarPlanillaRoster(uproyectoEscogido);

      this.router.navigate(
        [
          "/roster",
          this.planilla, // Planilla Id
          this.filtroDetallePlanilla.controls["uproyecto"].value, // Unidad de proyecto Id
          1, //ID MASTER PERSONAL
        ],
        {
          state: {
            nombrePlanilla: this.planillaNombre,
            nombreUnidadProyecto: uproyectoEscogido.unidNombre,
          },
        }
      );
    }
  }

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
}
