import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { VacanteDTO } from 'src/app/shared/model/database-dto/vacanteDTO';
import { Router } from '@angular/router';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { VacanteDetalleDTO } from 'src/app/shared/model/database-dto/vacanteDetalleDTO';
import { MatTableDataSource } from '@angular/material/table';
import { EditarEstatusComponent } from './editar-estatus/editar-estatus/editar-estatus.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-vacante-detalle',
  templateUrl: './vacante-detalle.component.html',
  styleUrls: ['./vacante-detalle.component.css']
})
export class VacanteDetalleComponent implements OnInit {
  state: any;
  vacante: VacanteDTO;
  filtro: FiltroDTO;
  vacanteDetalle: VacanteDetalleDTO[];
  vacantes: VacanteDTO[];
  selectedVacante: number;

  planId: number;
  vacId: number;
  listvacanteDetalleDataSource: MatTableDataSource<any>;

  columnsPostulaciones: string[] = ['position', 'nombres','apellidos', 'dni','reAtracTaleto', 'rePruebaTecnica', 'estatus' ];

  constructor(private router: Router,
    private construtechService: ConstrutechService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      
      this.vacId = params.vacanteId;
      this.planId = params.planillaId;
      //console.log(this.planId)
      this.getVacanteDetalle(this.vacId)
      
    });
   
    //this.planId = Number(sessionStorage.getItem("planillaId"));
   //  console.log(this.planId)
    this.getVacantes2()
  }

  getVacanteDetalle(vacante: number) {

    sessionStorage.setItem("vacante", vacante.toString())
    console.log("VACANTE")
    console.log(this.vacante)
    console.log(this.selectedVacante)

    this.filtro = new FiltroDTO()
    this.filtro.filterVacanteId = vacante

    this.construtechService.getVacantesDetallesPorVacante(this.filtro)
    .subscribe(
      res => {
        if (res.codigo === 1000 || res.codigo === 1044) {
          console.log(res.data)
          //this.vacanteDetalle = res.data
          this.listvacanteDetalleDataSource = new MatTableDataSource<any>(res.data);
          //this.listvacanteDetalleDataSource.data = res.data
        } else {
          //this.utils.error("Filtros", res.mensaje)
        }
      },
      err => {
        console.log(JSON.stringify(err))
      }
    )
  }

  public getVacantes2() {
    this.filtro.filterPlanId = this.planId
    this.filtro.filterUproId = -1
    console.log("FILTRO VACNATES")
   console.log(this.filtro)
    this.construtechService.getVacantes(this.filtro)
      .subscribe(
        res => {
          if (res.codigo === 1000) {

            this.vacantes = res.data
            
          } else {
           // this.utils.error("Filtros", res.mensaje)
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
  }

  openDialog(vacanteId: number): void {
    const dialogRef = this.dialog.open(EditarEstatusComponent, {
      data: vacanteId
    });
  }

}
