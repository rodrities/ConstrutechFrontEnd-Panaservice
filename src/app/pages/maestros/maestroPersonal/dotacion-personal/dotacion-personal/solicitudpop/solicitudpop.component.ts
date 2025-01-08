import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsolidadopopComponent } from '../../../crear-dotacion/consolidadopop/consolidadopop.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-solicitudpop',
  templateUrl: './solicitudpop.component.html',
  styleUrls: ['./solicitudpop.component.css']
})
export class SolicitudpopComponent implements OnInit {

  columns: string[] = ['perfil', 'nombre', 'estado', 'fecha']
  aprobadorDataSource = new MatTableDataSource<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<ConsolidadopopComponent>,
    private construtechService: ConstrutechService) {
      console.log(data);
  }

  ngOnInit(): void {
    if(this.data != null || this.data != undefined){
      this.construtechService.getAprobadores(this.data)
      .subscribe(
        res => {
          if (res.codigo === 1000) {
            console.log(res.data)
            this.aprobadorDataSource = new MatTableDataSource(res.data)
          } else {
            
          }
        },
        err => {
          console.log(JSON.stringify(err))
        }
      )
    }
  }

  close(data?: any){
    this.dialogRef.close()
  }
}
