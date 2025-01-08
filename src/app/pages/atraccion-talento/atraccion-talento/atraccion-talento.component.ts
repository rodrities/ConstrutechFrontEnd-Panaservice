import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Component, OnInit, ViewChild } from '@angular/core';

import { ConstrutechService } from 'src/app/shared/services/construtech.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from 'src/app/core/components/form/form/form.component';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import { MatPaginator, PageEvent } from '@angular/material/paginator';




@Component({
  selector: 'app-atraccion-talento',
  templateUrl: './atraccion-talento.component.html',
  styleUrls: ['./atraccion-talento.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],

})
export class AtraccionTalentoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSizeOptions = [5, 10, 15]
  filtro: FiltroDTO;
  pageSize: number = 10
  pageNumber: number = 0
  dataSource: MatTableDataSource<any>;
  length: number;
  columnsPlanilla: string[] = ['planEmpDesc', 'planDes', 'planFeCrea', 'planFeE', 'planFeI', 'planRem', 'planFeIng', 'planFeIIng', 'planPlan', 'planProy', 'planArchEmo', 'planArchInd'];


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

  openModal(): void {
    this.dialog.open(FormComponent, {
      width: '50%',
      height: '100vh',
    });
  }

  onSearch() {
    this.spinner.show();
    this.filtro = new FiltroDTO();
    this.filtro.pageNumber = this.pageNumber;
    this.filtro.pageSize = this.pageSize;
    this.construtechService.listAtraccion(this.filtro).subscribe(
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

}
