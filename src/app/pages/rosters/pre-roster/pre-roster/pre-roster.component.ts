import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardComponent } from 'src/app/core/components/dashboard/dashboard.component';
import { PlanillaDTO } from 'src/app/shared/model/database-dto/planillaDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { PlanillaArrayDTO} from 'src/app/shared/model/lista-dto/planillaDetailleDTO';
import { PaginadoDTO } from 'src/app/shared/model/paginadoDTO';
import { ResponseDTO } from 'src/app/shared/model/responseDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { UtilTools } from 'src/app/shared/util/util-tools';

@Component({
  selector: 'app-pre-roster',
  templateUrl: './pre-roster.component.html',
  styleUrls: ['./pre-roster.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})


export class PreRosterComponent implements OnInit {

  public state = '';

  vistaPreRoster: boolean = true
  vistaRoster: boolean = false

  filtroGroup: FormGroup;
  planillas: PlanillaDTO[];
  uproyectos: UnidadDTO[];

  filtro: FiltroDTO;

  dataSourceRoster = new MatTableDataSource<PlanillaDTO>();
  columnsRoster: string[] = ['planilla', 'detalle'];
  pageSizeOptions = [5, 10, 15]
  pageSize: number = 10
  pageIndex: number = 0
  length: number;

  @ViewChild(MatPaginator, { static: true }) paginatorRoster: MatPaginator;

  nombreUProyecto: string;
  nombrePlanilla: string;

  filteredObjetos: PlanillaDTO[] = [];
  searchTerm: string = '';
  filteredObjetos2: UnidadDTO[] = [];
  searchTerm2: string = '';
  selectedPlanId = -1;
  selectedUnidId = -1;


  
  constructor(
    private router: Router,
    
    private utils: UtilTools,
    private formBuilder: FormBuilder,
    private construtechService: ConstrutechService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog

    
  ) { }

  ngOnInit(): void {
    this.enInicio();
  }

  
  openModal(){
    this.dialog.open(DashboardComponent, {
      width: '120%',
      height: '95vh',
      data : 'roster'
    });
  }

  private enInicio() {

    console.log("en inico")

    this.state = window.history.state

    this.filtroGroup = this.formBuilder.group({
      uproyectoId: new FormControl(-1),
      planillaId: new FormControl(-1),
    });

    if (this.state["pageId"] !== undefined
      && this.state["pageId"] === 3) {
      this.filtro = JSON.parse(this.state["filter"])
      this.filtroGroup.controls["uproyectoId"].setValue(this.filtro.filterUproId)
      this.filtroGroup.controls["planillaId"].setValue(this.filtro.filterPlanId)
      this.pageIndex = this.filtro.pageNumber
      this.pageSize = this.filtro.pageSize
    }
    
    this.getPlanillas_v2()
    this.getUproyecto()
    
    if (this.state["pageId"] !== undefined
      && this.state["pageId"] === 3) {
      this.getPlanillas_v3()
    } else {
      this.filtrarInicio()
    }
  }

  public getPlanillas_v2() {
    this.filtroGroup.controls['planillaId'].setValue(-1)

    this.filtro = new FiltroDTO()
    this.filtro.filterUproId = this.filtroGroup.controls['uproyectoId'].value
    this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));
    console.log(this.filtro)
    this.construtechService.getPlanillas_v2(this.filtro)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.planillas = res.data.sort((a, b) => {
              if (a.planDes < b.planDes) return -1;
              if (a.planDes > b.planDes) return 1;
              return 0;
            })
            this.filteredObjetos = this.planillas;
          } else {
            this.utils.error("Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  private getUproyecto() {
    this.spinner.show();
    this.filtro = new FiltroDTO()
    this.filtro.filterPlanId = this.filtroGroup.controls['planillaId'].value
    this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));

    this.construtechService.getUproyecto(this.filtro)
      .subscribe(
        res => {
          this.spinner.hide();
          if (res.codigo === 1000) {
            this.uproyectos = res.data.sort((a, b) => {
              if (a.unidNombre < b.unidNombre) return -1;
              if (a.unidNombre > b.unidNombre) return 1;
              return 0;
            })
            this.filteredObjetos2 = this.uproyectos;
          } else {
            this.utils.error("Filtros", res.mensaje)
          }
        },
        err => {
          this.spinner.hide();
          console.log(JSON.stringify(err))
        }
      )
  }

  public getPlanillas_v3() {
    this.spinner.show();
    this.filtro = new FiltroDTO()
    console.log("EN GETPLANILLA3")
    
    //this.filtro.filterUproId = this.filtroGroup.controls['uproyectoId'].value;
    this.filtro.filterUproId = this.selectedUnidId;
    if (!this.filtro.filterUproId) this.filtro.filterUproId = -1;
    console.log(this.filtro.filterUproId)
    this.filtro.filterPlanId = this.selectedPlanId;
    //this.filtro.filterPlanId = this.filtroGroup.controls['planillaId'].value
    if (!this.filtro.filterPlanId) this.filtro.filterPlanId = -1;
    console.log(this.filtro.filterPlanId)
    this.filtro.pageNumber = this.pageIndex
    this.filtro.pageSize = this.pageSize
    this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));

    this.construtechService.getPlanillas_v3(this.filtro)
      .subscribe(
       ( res: ResponseDTO<PaginadoDTO<PlanillaDTO>>) => {
          this.spinner.hide();
          if (res.codigo === 1000) {
            this.length = res.data.totalElements

            let objPlanilla : PlanillaDTO[] = [];

            objPlanilla = this.sinceratePlanillas(res);
           
            this.dataSourceRoster = new MatTableDataSource<PlanillaDTO>(objPlanilla);

            this.paginatorRoster = this.dataSourceRoster.paginator

            this.sinceratePlanillas(res);
            
          } else {
            this.dataSourceRoster = null;
            this.utils.error("Planillas", res.mensaje)
            if (res.codigo === 1011 ) {
              console.log("IR A LOGIN")
              //this.router.navigate(['/authentication']);
              sessionStorage.setItem("token", '');
              sessionStorage.setItem("perfil", '');
              sessionStorage.setItem("usuarioid", '');
              sessionStorage.setItem("flagLogueo", "false");
              this.router.navigate(["/authentication"])
              
              //this.router.navigateByUrl('localhost:4200/authentication')
              //window.location.assign("/#/authentication")
              console.log("LOGIN")
            }

          }
        }
      )
  }

  public sinceratePlanillas(resp: ResponseDTO<PaginadoDTO<PlanillaDTO>>): PlanillaDTO[] {
  
    const mapaDePlanIds = new Map();
    const resultado: PlanillaDTO[] = [];

    for (const objeto of resp.data.content) {
      if (!mapaDePlanIds.has(objeto.planId)) {
        mapaDePlanIds.set(objeto.planId, true);
        resultado.push(objeto);
      }
    }

    console.log(resultado)

    return resultado;
  
  }
  
  public pageChanged(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length
    this.getPlanillas_v3();
  }

  public filtrarInicio() {
    

    this.pageIndex = 0
    this.pageSize = 10

    this.getPlanillas_v3();
  }

  public filtrar(event: MatAutocompleteSelectedEvent) {
    this.selectedPlanId = event.option.value;
    const selectedPlanId = event.option.value;
    const selectedObjeto = this.filteredObjetos.find(objeto => objeto.planId === selectedPlanId);
    if (selectedObjeto) {
      this.searchTerm = selectedObjeto.planDes;
    }

    this.pageIndex = 0
    this.pageSize = 10
    
    this.getPlanillas_v3();
  }
  public filtrar2(event: MatAutocompleteSelectedEvent) {
    this.selectedUnidId = event.option.value;
    const selectedUnidId = event.option.value;
    const selectedObjeto = this.filteredObjetos2.find(objeto => objeto.unidId === selectedUnidId);
    if (selectedObjeto) {
      this.searchTerm2 = selectedObjeto.unidNombre;
    }

    this.pageIndex = 0
    this.pageSize = 10
    
    this.getPlanillas_v3();
  }
  /*private eventUproyecto() {
    if (this.filtroGroup.controls['uproyectoId'].value !== -1)
      this.filtroGroup.controls['planillaId'].enable()
    else 
      this.filtroGroup.controls['planillaId'].disable()
  }*/

  public getRoster(planillaDTO: PlanillaDTO) {
    
    this.filtro = new FiltroDTO()

    this.filtro.pageNumber = this.pageIndex
    this.filtro.pageSize = this.pageSize
    this.filtro.filterUproId = this.filtroGroup.controls['uproyectoId'].value
    this.filtro.filterPlanId = this.filtroGroup.controls['planillaId'].value

    let filterDto = JSON.stringify(this.filtro)
    
    this.router.navigate(['/roster',
      planillaDTO.planDes
    ], {
      state: {
        nombrePlanilla: planillaDTO.planDes,
        nombreUnidadProyecto: planillaDTO.planUProyectoNombre,
        filter: filterDto,
        idPlanilla: planillaDTO.planId,
        idUProyecto: planillaDTO.planUproId,
        identificadorPlanilla: 2
      }
    });
  }

  public filterOptions() {
    console.log(this.searchTerm)
    if (typeof this.searchTerm === 'string' && this.searchTerm.trim() !== '') {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredObjetos = this.planillas.filter(objeto =>
        objeto.planDes.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredObjetos = this.planillas;
    }
  }
  public filterOptions2() {
    console.log(this.searchTerm2)
    if (typeof this.searchTerm2 === 'string' && this.searchTerm2.trim() !== '') {
      const searchTermLower = this.searchTerm2.toLowerCase();
      this.filteredObjetos2 = this.uproyectos.filter(objeto =>
        objeto.unidNombre.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredObjetos2 = this.uproyectos;
    }
  }
}
