import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CargoDTO } from 'src/app/shared/model/database-dto/cargoDTO';
import { PlanillaDTO } from 'src/app/shared/model/database-dto/planillaDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';
import { UProyectoDTO } from 'src/app/shared/model/database-dto/uproyectoDTO';
import { VacanteDTO } from 'src/app/shared/model/database-dto/vacanteDTO';
import { Cargo } from 'src/app/shared/model/database-entities/cargo';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ResponseDTO } from 'src/app/shared/model/responseDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { UtilTools } from 'src/app/shared/util/util-tools';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.css']
})
export class VacantesComponent implements OnInit {

  motivos = [
    "Promocion", "Descanso Medico", "Cese", "Vacaciones", "Nuevo Puesto", "Investigacion Personal", "Reubicacion"
  ]

  filtroGroup: FormGroup;
  filtroGroup2: FormGroup;
  planillas: PlanillaDTO[];
  searchTerm: string = '';
  filteredObjetos: PlanillaDTO[] = [];
  searchTerm2: string = '';
  selectedPlanId = -1;
  selectedUnidId = -1;
  dataSourceVacantes = new MatTableDataSource<VacanteDTO>();
  columnasVacantes: string[] = ['planilla', 'uproyecto', 'cargo', 'motivo', 'fecha', 'detalle'];
  planillaDesc: string;

  filtro: FiltroDTO;
  filtro2: FiltroDTO;

  vacantes: VacanteDTO[];

  cargos: CargoDTO[];
  upro: UProyectoDTO[];

  vacanteRequest: VacanteDTO = new VacanteDTO()

  listUnidades: UnidadDTO[];

  constructor(
    private formBuilder: FormBuilder,
    private construtechService: ConstrutechService,
    private utils: UtilTools,
    private router: Router
  ) {
    
   }

  ngOnInit(): void {
    this.filtroGroup = this.formBuilder.group({
      uproyectoId: new FormControl(-1),
      planillaId: new FormControl(-1),
    });
    this.filtroGroup2= this.formBuilder.group({
      uproyectoId: new FormControl(-1),
      planillaId: new FormControl(-1),
      cargoId: new FormControl(-1),
      motivo: new FormControl(-1),
    });
    this.getPlanillas_v2();
    this.getVacantes()

    this.getUnidades()
    this.getCargos()
  }

  crearVacante2() {
    console.log(this.vacanteRequest)

    this.construtechService.createVacante(this.vacanteRequest).subscribe(
      res => {
        window.location.reload();
      }
    )

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

  public getVacantes() {
    this.filtro.filterPlanId = this.filtroGroup.controls['planillaId'].value
    console.log("FILTRO VACNATES")
   console.log(this.filtro)
    this.construtechService.getVacantes(this.filtro)
      .subscribe(
        res => {
          if (res.codigo === 1000) {

            this.dataSourceVacantes = new MatTableDataSource<VacanteDTO>(res.data);
            
          } else {
            this.utils.error("Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  public getVacantes2() {
    this.filtro.filterPlanId = this.selectedPlanId
    this.filtro.filterUproId = this.selectedUnidId
    console.log("FILTRO VACNATES")
   console.log(this.filtro)
    this.construtechService.getVacantes(this.filtro)
      .subscribe(
        res => {
          if (res.codigo === 1000) {

            this.dataSourceVacantes = new MatTableDataSource<VacanteDTO>(res.data);
            
          } else {
            this.utils.error("Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  crearVacante() {
    this.getUnidades()
    this.getCargos()
  }

  getUnidades(){

    
     // sessionStorage.setItem('planId', this.selectedPlanId.toString())
    

    this.filtro2 = new FiltroDTO();
      this.filtro2.filteruserId = Number(sessionStorage.getItem('usuarioid'));
      this.filtro2.filterPlanId = this.selectedPlanId;
      this.construtechService.getUproyecto(this.filtro2).subscribe(
        (res: ResponseDTO<UnidadDTO[]>) => {
          this.listUnidades = res.data
          console.log(this.listUnidades)
          
        }
      )
  }

  public verDetalle(planId: number) {
    sessionStorage.setItem("planillaId", planId.toString())
  }

public getCargos() {
  this.filtro2 = new FiltroDTO()
    

    //TRAEMOS CARGOS
    this.construtechService.getCargosV3()
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            this.cargos = res.data
            console.log(this.cargos)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
}

  

}
