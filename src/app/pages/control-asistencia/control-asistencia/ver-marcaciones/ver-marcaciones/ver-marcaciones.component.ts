import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent, User } from 'src/app/core/components/form/form/form.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-ver-marcaciones',
  templateUrl: './ver-marcaciones.component.html',
  styleUrls: ['./ver-marcaciones.component.css']
})
export class VerMarcacionesComponent implements OnInit {
  //PAGINACION
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSizeOptions = [5, 10, 15]
  filtro: FiltroDTO;
  pageSize: number = 10
  pageNumber: number = 0
  dataSource: MatTableDataSource<any>;
  length: number;

  columnsMarc: string [] = ['nombCompleto','cargDescripcion','perNuDoc','fechaMarc'];

  options: string[] = ['One', 'Two', 'Three'];
  
  searchTerm = new FormControl();

  term: string = null;
  filteredObjetos: any[] = [];
  
  constructor(
    private construtechService: ConstrutechService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { 
    this.setupAutocomplete();
  }

  ngOnInit(): void {
    this.pageNumber = 0
    this.pageSize = 10
  }

  back(){
    
  }

  setupAutocomplete(): void {
    this.filtro = new FiltroDTO();
    this.filtro.pageNumber = this.pageNumber;
    this.filtro.pageSize = this.pageSize;

    this.searchTerm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(term => {
        this.filtro.pageNumber = 0;
        this.term = term
        this.filtro.filterPerDoc = this.term; 
        return this.construtechService.listMarcaciones(this.filtro); 
      })
    ).subscribe(
      (res: any) => {
        this.pageNumber = 0;
        if (res.codigo === 1000 && res.data.content.length > 0) {
          this.dataSource = new MatTableDataSource(res.data.content);
          this.length = res.data.totalElements;
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }
    );
  }
  
  

  displayFn(objeto: any): string {
    return objeto ? objeto.persNombreComp : '';
  }

  public pageChanged(event?: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length
    this.list();
  }

  list(event?: any){
    this.spinner.show();
    this.filtro = new FiltroDTO();
    this.filtro.pageNumber = this.pageNumber;
    this.filtro.pageSize = this.pageSize;
    this.filtro.filterPerDoc = this.term;
    this.construtechService.listMarcaciones(this.filtro).subscribe(
      (res: any)=>{
        console.log(res)
        if (res.codigo === 1000 && res.data.content.length > 0) {
          this.dataSource = new MatTableDataSource(res.data.content);
          this.length = res.data.totalElements;
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      },
      error => {
        console.log(error)
        this.spinner.hide();
      }
    )
  }

  save(){
    let valor = sessionStorage.getItem('usuarioid');
    console.log(valor)
  }

}
