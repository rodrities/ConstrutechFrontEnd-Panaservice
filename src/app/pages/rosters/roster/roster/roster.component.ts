import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FechalaboralpopComponent } from './fechalaboralpop/fechalaboralpop.component';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import { RusterDTO } from 'src/app/shared/model/database-dto/rusterDTO';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { ProgramacionDTO } from 'src/app/shared/model/database-dto/programacionDTO';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { PersonalDTO } from 'src/app/shared/model/database-dto/personalDTO';
import { FiltroDTO } from 'src/app/shared/model/filtroDTO';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import moment from 'moment';
import { UtilTools } from 'src/app/shared/util/util-tools';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlanillaUsuarioDTO } from 'src/app/shared/model/database-dto/planillaUsuarioDTO';
import { RosterDetail } from 'src/app/shared/model/database-dto/rosterDetail';
import { UProyectoDTO } from 'src/app/shared/model/database-dto/uproyectoDTO';
import { ResponseDTO } from 'src/app/shared/model/responseDTO';
import { UnidadDTO } from 'src/app/shared/model/database-dto/unidadDTO';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})

export class RosterComponent implements OnInit {

  public state: any = {};

  FONDO_COLOR = {
    T: '#00FF00',
    V: '#FFFF00',
    DL: '#00FFFF',
    FT: '#FF0000',
    F: '#B46DB4',
    LCG: '#ADD8E6',
    LSG: '#0000FF',
    DM: '#FFA500',
    AT: '#8B4513',
    DPN: '#FF69B4',
    DPRN: '#228B22',
    LPP: '#808080',
    LPF: '#000000',
    SRC: '#8B008B',
    PP: '#40E0D0',
    D: '#8B0000',
    R: '#32CD32',
    TC: '#A9A9A9',
    ND: '#D3D3D3'
  }

  nombrePlanilla: string = '';
  nombreUProyecto: string = '';
  dataRoster: RusterDTO[];
  dataRosterSort: RusterDTO[] = [];

  calendario: ProgramacionDTO[];

  //DATA EXTRA PARA FILTROS -- BACKUP
  dataRosterBackup: RusterDTO[];
  dataRosterTrabajadorBackup: RusterDTO[];

  //
  programacionTotalAlmacenada: any = [];
  programacionPorCargaAlmacenada: any = [];
  programacionAlmacenada = [];
  programacionFechas: ProgramacionDTO[] = [];

  listCargos = [];
  listPersonal = [];
  personalFiltrado: Observable<string[]>;
  personas: PersonalDTO[]

  generalDataRoster : RosterDetail[];

  listTrabajadoresDataSource: MatTableDataSource<any>[] = [];
  trabajadoresDataSource = new MatTableDataSource<PersonalDTO>();

  filtro: FiltroDTO;

  fechaIniBase: string = '';
  fechaFinBase: string = '';
  cargoSelected: string = '';

  listColumnsTrabajadores: string[][];
  columnsTrabajadores: string[] = ['position', 'checkbox', 'nombres', 'nuDoc'];

  dataTrabajadores: boolean = false;
  filtroTrabajadores: FormGroup;

  planillaId: number;
  uproyectoId: number;
  flagValidacion: boolean = false;
  pageId: number

  allComplete: boolean = false;
  selectedUnidad: number;
  listUnidades: UnidadDTO[];

  executeActualizarCalendario: boolean = true;
  executeEstadoLaboral: boolean = true;
  checkboxSelectionHeaders: boolean[] = [];
  checkboxSelections: boolean[][] = [];
  estadoLaboralArray: any[][][] = [];
  llenadoCargosPersonal: boolean = false;
  cargaronTrabajadore: boolean = false;

  employeFilter: FormControl = new FormControl('');
  constructor(
    private construtechService: ConstrutechService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utils: UtilTools,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  applyFilter(value) {    
    this.listTrabajadoresDataSource.forEach(dataSource => {
      dataSource.filter = value;
    });
  }

  ngOnInit() {
    this.state = window.history.state
    console.log(this.state)
    let fechaInicio: Date = moment().subtract(30, 'days').toDate();
    let fechaFin: Date = moment().add(14, 'days').toDate();
    this.fechaIniBase = fechaInicio.toISOString();
    this.fechaFinBase = fechaFin.toISOString();

    this.filtroTrabajadores = this.formBuilder.group({
      employeFilter: new FormControl(''),
      planilla: new FormControl(''),
      cargo: new FormControl(-1),
      start: new FormControl(this.datePipe.transform(fechaInicio, 'yyyy-MM-dd')),
      end: new FormControl(this.datePipe.transform(fechaFin, 'yyyy-MM-dd'))
    });

    this.filtroTrabajadores.get('employeFilter')
      .valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.applyFilter(value);
      });

    this.filtroTrabajadores.controls['start'].setValue(fechaInicio)

    this.employeFilter.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.applyFilter(value);
      });

    this.getUnidades();

  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("planId");
    sessionStorage.removeItem("idUProyecto");
    sessionStorage.removeItem("pageId");
    sessionStorage.removeItem("nombrePlanilla");
    sessionStorage.removeItem("nombreUProyecto");

  }

  validateUrl(filtro: FiltroDTO) {

    let planDesc: string = '';
    let proyId: number;
    console.log("okk2")
    this.activatedRoute.params.subscribe(params => {
      planDesc = params.planId;
    });

    console.log("okk22")
    this.filtro = new FiltroDTO();
    this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));
    this.filtro.filterplanDesc = planDesc;
    this.filtro.filterUproId = filtro.filterUproId;
    this.construtechService.validateUserRoster(this.filtro).subscribe(
      (res: PlanillaUsuarioDTO) => {
        console.log("okk222")
        if (res) {
          this.nombreUProyecto = res.proyDesc;
          this.nombrePlanilla = res.planDesc;

          this.planillaId = res.planId;
          this.uproyectoId = res.proyId;
          this.pageId = 2;
          
        }else{
          console.log("ok1")
          this.router.navigate(['pre-roster']);
        }


      }
    )


    this.getTrabajadores(filtro.filterUproId);
  }

  // async llenarCargosyPersonal() {
  //   this.dataRoster.forEach(dataCargos => {
  //     this.listCargos.push(dataCargos.rusterCargo);
  //     dataCargos.rusterPersonal.forEach(dataPersonal => {
  //       this.listPersonal.push(dataPersonal.persNombreComp);
  //     })
  //   })
  //   this.llenadoCargosPersonal = true
  // }

  // private autoComplete(value: string): Observable<string[]> {

  //   const filterValue = value.toLowerCase();

  //   const filteredList = this.listPersonal.filter((element) => {
  //     return element.toLowerCase().includes(filterValue);
  //   });

  //   return of(filteredList);
  // }

  estadoLaboral(element: PersonalDTO, dia: ProgramacionDTO) {
    const diaProgramacion = element.programacion.find(item => item.diaLaboral === dia.diaLaboral);

    return diaProgramacion ? diaProgramacion.estadoLaboral : 'ND';
  }


    getTrabajadores(id :number) {
    this.spinner.show();
    this.filtro = new FiltroDTO()
    this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));
    this.filtro.filterPlanId = Number(sessionStorage.getItem('planId'));
    this.filtro.filterUproId = id
    this.filtro.filterFecIni = this.datePipe.transform(this.filtroTrabajadores.controls['start'].value, 'yyyy-MM-dd');
    this.filtro.filterFecFin = this.datePipe.transform(this.filtroTrabajadores.controls['end'].value, 'yyyy-MM-dd');
    this.construtechService.getInitialDataRoster2(this.filtro).subscribe(
      res => {
        if (res.codigo === 1000) {
          this.dataRoster = []
          this.dataRoster = res.data;
          console.log(this.dataRoster)
          for (let i = 0; i < this.dataRoster.length; i++ ) {
            let tempRoster: RusterDTO = new RusterDTO()
            tempRoster.rusterCargo = this.dataRoster[i].rusterCargo
            console.log("1")
            for (let j = 0; j < this.dataRoster[i].rusterPersonal.length; j++ ) {
              //let sortedpersonal: PersonalDTO[] = this.dataRoster[i].rusterPersonal.sort(())}
              console.log("2")
              this.dataRoster[i].rusterPersonal.sort((a, b) => a.persNombreComp.localeCompare(b.persNombreComp));
            }
            console.log(this.dataRoster[i].rusterPersonal)
          }
          this.dataRoster[0].rusterPersonal
          this.dataRosterBackup = this.dataRoster;
          this.llenarArregloCheckbox();
        //  this.llenarCargosyPersonal().then((res) => {
        //     this.personalFiltrado = this.filtroTrabajadores.controls['planilla'].valueChanges.pipe(
        //       startWith(''),
        //       switchMap(value => this.autoComplete(value || '')))
        //   });

          this.calendario = this.rangoFechas()

          //ANTES DE CREAR LAS TABLAS FILTRAR POR CARGO Y TRABAJADOR SI TUVIERAN DATOS

          this.crearListaTablas();
          this.dataTrabajadores = true;

          this.spinner.hide();
          this.cargaronTrabajadore = true;
        } else {
          this.spinner.hide();
          Swal.fire({
            type: "info",
            title: "Roster",
            html: res.mensaje,
            confirmButtonColor: this.translate.instant("alert.alert_button_color")
          });
        }
      },
      err => {
        this.utils.CloseTimer()
        Swal.fire({
          type: "info",
          title: "Roster",
          html: err.mensaje,
          confirmButtonColor: this.translate.instant("alert.alert_button_color")
        });
      }
    )
  }


  getTrabajadoresByFiltro() {
    //this.utils.Timer();
    this.spinner.show();
    this.filtro = new FiltroDTO()
    this.filtro.filterPlanId = this.planillaId
    this.filtro.filterUproId = this.uproyectoId
    this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));
    this.filtro.filterFecIni = this.datePipe.transform(this.filtroTrabajadores.controls['start'].value, 'yyyy-MM-dd');
    this.filtro.filterFecFin = this.datePipe.transform(this.filtroTrabajadores.controls['end'].value, 'yyyy-MM-dd');


    if (this.filtro.filterFecIni != this.datePipe.transform(this.fechaIniBase, 'yyyy-MM-dd')
      || this.filtro.filterFecFin != this.datePipe.transform(this.fechaFinBase, 'yyyy-MM-dd')) {
      this.construtechService.getInitialDataRoster2(this.filtro).subscribe(
        res => {
          if (res.codigo === 1000) {
            this.dataRoster = []
            this.dataRoster = res.data
            this.dataRosterBackup = this.dataRoster;
            this.calendario = this.rangoFechas()

            //ANTES DE CREAR LAS TABLAS FILTRAR POR CARGO Y TRABAJADOR SI TUVIERAN DATOS

            this.crearListaTablas();
            this.dataTrabajadores = true;
            // this.utils.CloseTimer();
            this.spinner.hide();
          } else {
            // this.utils.CloseTimer();
            this.spinner.hide();
            Swal.fire({
              type: "info",
              title: "Roster",
              html: res.mensaje,
              confirmButtonColor: this.translate.instant("alert.alert_button_color")
            });
          }
        },
        err => {
          // this.utils.CloseTimer();
          this.spinner.hide();
          Swal.fire({
            type: "info",
            title: "Roster",
            html: err.mensaje,
            confirmButtonColor: this.translate.instant("alert.alert_button_color")
          });
        }
      )
    } else {
      this.spinner.hide();
      Swal.fire({
        type: "info",
        title: "Roster",
        html: "Las fechas seleccionadas no han sido cambiadas",
        confirmButtonColor: this.translate.instant("alert.alert_button_color")
        });
    }

  }


  getUnidades(){

    if(this.state.idPlanilla && !sessionStorage.getItem('planId')){
      sessionStorage.setItem('planId', this.state.idPlanilla)
    }

    if (!sessionStorage.getItem('planId')) {
      this.router.navigate(['pre-roster']);
      return;
    }

    this.filtro = new FiltroDTO();
      this.filtro.filteruserId = Number(sessionStorage.getItem('usuarioid'));
      this.filtro.filterPlanId = Number(sessionStorage.getItem('planId'));
      this.construtechService.getUproyecto(this.filtro).subscribe(
        (res: ResponseDTO<UnidadDTO[]>) => {
          this.listUnidades = res.data
          this.selectedUnidad = this.listUnidades[0].unidId;
          this.filtro.filterUproId = this.selectedUnidad;
          this.validateUrl(this.filtro);
        }
      )
  }

  trabajadoresChange(event) {
    console.log(event)
    if (this.dataRosterBackup != undefined) {
      this.dataRoster = this.dataRosterBackup
      if (event.value != -1) {
        const newArr: RusterDTO[] = this.dataRoster.filter(e => {
          return e.rusterCargo == event.value;
        })

        this.dataRoster = newArr;
        this.dataRosterTrabajadorBackup = this.dataRoster;
      }
      // this.listPersonal = [];
      // this.llenarCargosyPersonal().then((res) => {
      //   this.personalFiltrado = this.filtroTrabajadores.controls['planilla'].valueChanges.pipe(
      //     startWith(''),
      //     switchMap(value => this.autoComplete(value || '')))
      // });
      this.crearListaTablas()
      this.filtroTrabajadores.controls['planilla'].setValue("")
    }
  }

  unidadChange(event) {
    console.log(event)
    if (event.value) {
      this.filtro = new FiltroDTO();
      this.filtro.filterUproId = event.value;
      this.validateUrl(this.filtro)
    }else{
      console.log("sin id")
    }
  }

  personalSeleccionado(event) {

    if (this.dataRoster[0].rusterPersonal.length == 1) {
      this.dataRoster = this.dataRosterTrabajadorBackup;
    }

    const personalFiltrado = this.dataRoster.filter(e => {
      return e.rusterPersonal.some(personal => {
        return personal.persNombreComp === event.option.value

      })
    })

    if (personalFiltrado.length > 0) {
      const personalEncontrado = personalFiltrado[0].rusterPersonal.find(personal => personal.persNombreComp === event.option.value);
      const rusterEncontrado: RusterDTO[] = [{
        rusterCargo: personalFiltrado[0].rusterCargo,
        rusterPersonal: [personalEncontrado]
      }];

      this.dataRoster = rusterEncontrado;
    }

    this.crearListaTablas()
  }

  rangoFechas() {
    this.columnsTrabajadores = ['position', 'checkbox', 'nombres', 'nuDoc'];
    this.programacionFechas = [];

    const programacion: ProgramacionDTO[] = [];
    const fechaActual = new Date(this.filtroTrabajadores.controls['start'].value)
    const diferenciaDias = differenceInDays(new Date(this.filtroTrabajadores.controls['end'].value), fechaActual);

    let programacionDto: ProgramacionDTO;

    for (let i = -1; i < diferenciaDias; i++) {
      programacionDto = new ProgramacionDTO()
      programacionDto.id = null

      const fechaCol = format(fechaActual, "MMM'\n'dd", { locale: es }).toUpperCase();

      programacionDto.diaLaboral = format(fechaActual, "dd-MM-yyyy")
      programacionDto.diaLaboralFormat = fechaCol;
      programacionDto.estadoLaboral = 'ND'

      programacion.push(programacionDto)
      this.programacionFechas.push(programacionDto)
      this.columnsTrabajadores.push(fechaCol);

      fechaActual.setDate(fechaActual.getDate() + 1); // Añadir un día
    }

    return programacion;
  }

  crearListaTablas() {
    this.trabajadoresDataSource = new MatTableDataSource()
    this.listTrabajadoresDataSource = []
    for (let i = 0; i < this.dataRoster.length; i++) {
      this.trabajadoresDataSource = new MatTableDataSource(this.dataRoster[i].rusterPersonal);
      this.listTrabajadoresDataSource.push(this.trabajadoresDataSource);
    }
  }

  ////////////////////////////////
  actualizarCalendario(element: any, cargo: string, fecha: any, numTabla: number) {
    
    fecha = fecha.replace('\n', ' ')
    let actualPersDepId = element.persPlanillaDetalleId;
    let fechaLimite = this.datePipe.transform(this.filtroTrabajadores.controls['end'].value, 'dd-MM-yyyy');

    let dataEnvio = { fechaEnviada: fecha, trabajador: element, fechaLimite: fechaLimite }
    let dialogRef = this.dialog.open(FechalaboralpopComponent, {
      height: "fit-content",
      autoFocus: false,
      disableClose: true,
      data: dataEnvio,
    });

    dialogRef.afterClosed()
    .subscribe(res => {
      console.log(res)
      console.log(this.checkboxSelections)
      if (res != null || res != undefined) {
        for (let i = 0; i < this.checkboxSelections[numTabla].length; i++) {
          if(this.checkboxSelections[numTabla][i]) {
            actualPersDepId = this.dataRoster[numTabla].rusterPersonal[i].persPlanillaDetalleId;
            for (let pro = 0; pro < this.dataRoster[numTabla].rusterPersonal[i].programacion.length; pro++) {
              console.log(this.dataRoster[numTabla].rusterPersonal[i].programacion)
              for (let r = 0; r < res.data.length; r++) {
                if(this.dataRoster[numTabla].rusterPersonal[i].programacion[pro].diaLaboral === res.data[r].diaLaboral) {
                  this.dataRoster[numTabla].rusterPersonal[i].programacion.splice(pro, 1)
                }
                //this.dataRoster[numTabla].rusterPersonal[i].programacion.push(res[r])
                console.log(this.dataRoster[numTabla].rusterPersonal[i].programacion)
              }
            }

            for (let r = 0; r< res.data.length; r++) {
              
              this.dataRoster[numTabla].rusterPersonal[i].programacion.push(res.data[r])
              console.log(this.dataRoster[numTabla].rusterPersonal[i].programacion)
            }
            
           /// this.dataRoster[numTabla].rusterPersonal[i].programacion

           // this.listTrabajadoresDataSource[numTabla].data[i].programacion


            //console.log(this.listTrabajadoresDataSource[numTabla])
    //        console.log(this.checkboxSelections[numTabla][i])
            //ROSTER DATA
            /*this.dataRoster.forEach(x => {
              if (x.rusterCargo === cargo) {
              //  console.log(cargo)
                x.rusterPersonal.forEach(y => {
                  if (y.persNuDoc === this.dataRoster[numTabla].rusterPersonal[i].persNuDoc) {
                   // console.log(this.listTrabajadoresDataSource[numTabla])
                   // console.log(this.dataRoster[numTabla].rusterPersonal[i].persNuDoc)
                    actualPersDepId = this.dataRoster[numTabla].rusterPersonal[i].persPlanillaDetalleId;
                  //  console.log(this.listTrabajadoresDataSource[numTabla])
                 //   console.log(actualPersDepId)
                    if (y.programacion.length === 0) {
                   //   console.log("ENTRA AL IF")
                      res.data.forEach(element => {
                     //   console.log(this.listTrabajadoresDataSource[numTabla])
                       // console.log(y.programacion)
                        y.programacion.push(element)
                       // console.log(y.programacion)
                      });
                    } else {
                      res.data.forEach(d => {
                       // console.log(this.listTrabajadoresDataSource[numTabla])
                        let i = y.programacion.findIndex(z => (z.diaLaboral === d.diaLaboral))

                        if (i != -1) {
                          //console.log("EN EL IF -1")
                       //   console.log(this.listTrabajadoresDataSource[numTabla])
                         
                          d.id = y.programacion[i].id
                          y.programacion[i].estadoLaboral = d.estadoLaboral;
                        //  console.log(this.listTrabajadoresDataSource[numTabla])
                          //console.log(y.programacion)
                        } else {
                        //  console.log(this.listTrabajadoresDataSource[numTabla])
                          y.programacion.push(d)
                       //   console.log(this.listTrabajadoresDataSource[numTabla])
                          //console.log(y.programacion)
                        }
                      })
                    }
                  }
                })
              }
            })*/
            //console.log(this.programacionAlmacenada)
            console.log(this.listTrabajadoresDataSource[numTabla])

            res.data.forEach(x => {
              for (let p = 0; p < this.programacionAlmacenada.length; p++) {
                if(this.programacionAlmacenada[p].pperFecha===x.diaLaboral &&
                   this.programacionAlmacenada[p].pperPdepId===actualPersDepId &&
                   this.programacionAlmacenada[p].pperId===x.id) {
                    this.programacionAlmacenada.splice(p,1)
                   }
                   console.log(this.programacionAlmacenada)
                   console.log(this.listTrabajadoresDataSource[numTabla])
              }
              this.programacionAlmacenada.push({
                pperId: x.id,
                pperPdepId: actualPersDepId,
                pperFecha: x.diaLaboral,
                pperProeId: x.pperProeId
              });
              console.log(this.programacionAlmacenada)
            console.log(this.listTrabajadoresDataSource[numTabla])
              console.log(x)
             // console.log("push")
             /* const foundIndex = this.programacionAlmacenada.findIndex(programacion => programacion.pperPdepId == actualPersDepId && programacion.pperFecha == x.diaLaboral)
                this.programacionAlmacenada.push({
                  pperId: x.id,
                  pperPdepId: actualPersDepId,
                  pperFecha: x.diaLaboral,
                  pperProeId: x.pperProeId
                });*/
                console.log(this.listTrabajadoresDataSource[numTabla])
            });
            console.log(this.listTrabajadoresDataSource[numTabla])
          }
        }
      }
    });
    console.log("CALENDARIO")
    console.log(this.calendario)
    console.log("LISTTARBAJADORES SOURCE")
    console.log(this.listTrabajadoresDataSource[numTabla])
  }

  public validaRoster() {
    this.filtro = new FiltroDTO()
    this.filtro.filterProgramacion = this.programacionFechas
    this.filtro.filterRuster = this.dataRoster
    this.utils.Timer()
    this.construtechService.validateRoster(this.filtro).subscribe(
      res => {
        if (res.codigo === 1000) {
          this.flagValidacion = true;
          this.utils.CloseTimer()
          Swal.fire({
            type: "success",
            title: "Roster",
            html: res.mensaje,
            confirmButtonColor: this.translate.instant("alert.alert_button_color")
          });
        } else {
          this.flagValidacion = true;

          res.data.forEach(x => {
            let id = "th-" + x.cargo + "-" + x.dia;
            document.getElementById(id).style.backgroundColor = 'red';
          })


          this.utils.CloseTimer()

          Swal.fire({
            type: "info",
            title: "Roster",
            html: "Se encontraron dias que no cumplen el plan de trabajo estipulado",

            confirmButtonColor: this.translate.instant("alert.alert_button_color"),
          });
        }
      },
      err => {
        this.utils.CloseTimer()
        Swal.fire({
          type: "info",
          title: "Roster",
          html: err.mensaje,
          confirmButtonColor: this.translate.instant("alert.alert_button_color")
        });
      }
    )
  }

  public guardarCambiosRoster() {
    if (!this.flagValidacion) {
      Swal.fire({
        type: "info",
        title: "Roster",
        html: "Debes realizar por lo menos una validacion de tus datos a cargar",
        confirmButtonColor: this.translate.instant("alert.alert_button_color")
      });
    } else {
      Swal.fire({
        type: "info",
        title: "Guardar Roster",
        text: "¿Está seguro de guardar los cambios realizados en el roster? Verifique previamente si todo está correcto",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Si, estoy seguro",
        cancelButtonText: "No, voy a verificar",
        confirmButtonColor: this.translate.instant('alert.alert_button_color'),
        cancelButtonColor: this.translate.instant('alert.alert_button_color'),
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: (x) => {
        }
      }).then(
        response => {
          if (response.value) {
            //Servicio del Roster
            /* this.almacenarProgramacionTotal().then(() => {
              console.log(this.programacionTotalAlmacenada);
            })*/

            this.construtechService.saveRoster(this.programacionAlmacenada).subscribe(
              res => {
                if (res.codigo === 1000) {
                  this.utils.CloseTimer()
                  Swal.fire({
                    type: "success",
                    title: "Roster",
                    html: res.mensaje,
                    confirmButtonColor: this.translate.instant("alert.alert_button_color")
                  });
                } else {
                  Swal.fire({
                    type: "info",
                    title: "Roster",
                    html: res.mensaje,
                    confirmButtonColor: this.translate.instant("alert.alert_button_color")
                  });
                }
              },
              err => {
                Swal.fire({
                  type: "error",
                  title: "Roster",
                  html: err.mensaje,
                  confirmButtonColor: this.translate.instant("alert.alert_button_color")
                });
              }
            )
          }
        }
      )
    }
  }

  async almacenarProgramacionTotal() {
    this.dataRoster.forEach(async cargo => {
      this.programacionPorCargaAlmacenada = [];
      const result1 = await this.enlistarProgramacion(cargo)
    })
  }

  async enlistarProgramacion(cargo: any) {
    const result = await cargo.rusterPersonal.forEach(trabajador => {
      this.programacionPorCargaAlmacenada.push(trabajador.programacion);
    });
    this.programacionTotalAlmacenada.push(this.programacionPorCargaAlmacenada);
  }

  public regresar() {
    if (this.pageId + '' === '1') {
      this.router.navigate(['/personal'], {
        state: {
          vieneDeRoster: true,
          cargo: this.state["cargo"],
          centroCosto: this.state["centroCosto"],
          unidadGestion: this.state["unidadGestion"],
          unidadProyecto: this.state["unidadProyecto"],
          planillaId: this.state["planillaId"],
          empsId: this.state["empsId"]
        }
      })
    }
    if (this.pageId + '' === '2') {
      this.router.navigate(['/pre-roster'], {
        state: {
          pageId: 3,
          filter: this.state["filter"]
        }
      })
    }
  }

  limpiar() {
    this.filtroTrabajadores.controls['planilla'].setValue("")
    this.filtroTrabajadores.controls['cargo'].setValue(-1)
    this.dataRoster = this.dataRosterBackup;
    this.crearListaTablas();
  }

  checkAllCheckboxes(event: any, tableIndex: number) {
    for (let i = 0; i < this.checkboxSelections[tableIndex].length; i++) {
      this.checkboxSelections[tableIndex][i] = event.checked;
    }
    this.checkboxSelections[tableIndex]
    this.checkboxSelections
  }

  llenarArregloCheckbox() {
    for (let i = 0; i < this.dataRoster.length; i++) {
      this.checkboxSelectionHeaders.push(false)
      const rusterPersonalLength = this.dataRoster[i].rusterPersonal.length;
      const row: boolean[] = Array(rusterPersonalLength).fill(false);
      this.checkboxSelections.push(row);
    }
  }
}
