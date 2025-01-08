import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { FormBuilder, NgForm } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { UsuarioDTO } from "src/app/shared/model/database-dto/usuarioDTO";
import { TranslateService } from "@ngx-translate/core";
import { ConstrutechService } from "src/app/shared/services/construtech.service";
import { Router } from "@angular/router";
import { FiltroDTO } from "src/app/shared/model/filtroDTO";
import { UsuarioRequestDTO } from "src/app/shared/model/database-dto/usuarioRequestDTO";
import { NgxSpinnerService } from "ngx-spinner";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.css"],
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
export class UsuariosComponent implements OnInit {
  filtro: FiltroDTO;

  eliminarUsuarioRequest: UsuarioRequestDTO;

  usuarioDataSource = new MatTableDataSource<UsuarioDTO>();
  columnsUsuario: string[] = [
    "usuId",
    "perNuDoc",
    "perNomCompleto",
    "usuCorreo",
    "perNuTelefono",
    "usuEstId",
    "actions",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSizeOptions = [5, 10, 15];
  pageSize: number = 5;
  pageNumber: number = 0;
  length: number;

  @ViewChild(MatPaginator, { static: true }) paginatorMaster: MatPaginator;
  pageSizeOptionsMaster = [5, 10, 15];
  pageSizeMaster: number = 5;
  pageNumberMaster: number = 0;
  lengthMaster: number;

  buscarPersona: NgForm;

  usuariosFilter: UsuarioDTO[];
  filteredObjetos: UsuarioDTO[] = [];
  searchTerm: string = "";
  usuIdFilter: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private construtechService: ConstrutechService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    //rte this.getUsuarios();
    // rte  this.getUsuariosFilter();
  }

  public getUsuarios() {
    this.spinner.show();
    this.filtro = new FiltroDTO();
    //this.filtro.filterEmpId = this.filtroUsuario.controls['empresa'].value
    this.filtro.pageNumber = this.pageNumberMaster;
    this.filtro.pageSize = this.pageSizeMaster;
    this.filtro.filterUsuId = this.usuIdFilter;
    this.construtechService.getUsuarios(this.filtro).subscribe((res) => {
      if (res.codigo === 1000) {
        console.log(res.data);
        this.usuarioDataSource = new MatTableDataSource<UsuarioDTO>(
          res.data.content
        );
        this.lengthMaster = res.data.totalElements;
        console.log(this.lengthMaster);
        this.spinner.hide();
      } else {
        this.usuarioDataSource = null;
        this.spinner.hide();
        //this.alert("info", "Usuarios", res.mensaje)
      }
    });
  }

  public getUsuariosFilter() {
    this.construtechService.getUsuariosv2().subscribe((res) => {
      if (res.codigo === 1000) {
        console.log(res.data);
        this.usuariosFilter = res.data;
        this.filteredObjetos = res.data;
        console.log(this.filterOptions);
      } else {
        this.usuariosFilter = null;
      }
    });
  }

  public eliminarUsuario(id: number) {
    this.spinner.show();
    this.eliminarUsuarioRequest = new UsuarioRequestDTO();
    this.eliminarUsuarioRequest.usuId = id;
    this.construtechService.deleteUsuario(id).subscribe((res) => {
      this.spinner.hide();
      window.location.reload();
    });
  }

  filtrarTabla($event: any) {
    this.usuarioDataSource.filter = $event.target.value;
  }

  public pageChangedMaster(event?: PageEvent) {
    this.pageNumberMaster = event.pageIndex;
    this.pageSizeMaster = event.pageSize;
    this.lengthMaster = event.length;
    this.getUsuarios();
  }

  public filterOptions() {
    console.log(this.searchTerm);
    if (typeof this.searchTerm === "string" && this.searchTerm.trim() !== "") {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredObjetos = this.usuariosFilter.filter((objeto) =>
        objeto.perNomCompleto.toLowerCase().includes(searchTermLower)
      );
    } else {
      this.filteredObjetos = this.usuariosFilter;
    }
  }

  public selectUsurario(event: MatAutocompleteSelectedEvent) {
    this.usuIdFilter = event.option.value;
    this.searchTerm = "";
    this.getUsuarios();
  }
}
