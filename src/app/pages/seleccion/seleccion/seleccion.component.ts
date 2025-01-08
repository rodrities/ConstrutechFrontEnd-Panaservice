import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormComponent } from 'src/app/core/components/form/form/form.component';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { DetalleReemplazanteComponent } from '../detalle-reemplazante/detalle-reemplazante.component';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.css']
})
export class SeleccionComponent implements OnInit {

  pageSizeOptions = [5, 10, 15];
  filtro: FiltroDTO;
  pageSize: number = 10;
  pageNumber: number = 0;
  length: number;
  dataSource: MatTableDataSource<any>;
  columnsPlanilla: string[] = ['persNombreComp', 'persNuDoc', 'planillaDescrip', 'unidadProy' , 'cargDesc', 'ccosNombre', 'cateDesc', 'perFeCese', 'verDetalle','iniciarProceso'];
  dni: string;
  constructor(
    private construtechService: ConstrutechService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.pageNumber = 0
    this.pageSize = 10
    this.onSearch();
  }

  onSearch() {
    this.spinner.show();
    this.filtro = new FiltroDTO();
    this.filtro.pageNumber = this.pageNumber;
    this.filtro.pageSize = this.pageSize;
    this.construtechService.listPersonCese(this.filtro).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res);
        if (res.codigo === 1000 && res.data.content.length > 0) {
          this.dataSource = new MatTableDataSource(res.data.content);
          this.length = res.data.totalElements;
        } else {
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  public pageChanged(event?: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length
    this.onSearch();
  }

  showModal(dni: any){
    this.dialog.open(FormComponent, {
      width: '50%',
      height: '100vh',
      data: dni
    });
  }

  openDetailModal(data: any){
    this.dialog.open(DetalleReemplazanteComponent, {
      width: '50%',
      height: '85vh',
      data: data
    });
  }

}
