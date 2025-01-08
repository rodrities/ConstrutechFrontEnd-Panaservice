import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  estructura: boolean = false;
  dotacion: boolean = false;
  roster: boolean = false;
  marcaciones: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any
  ) { }

  ngOnInit(): void {
    console.log(this.inputData)
    switch (this.inputData) {
      case 'estructura':
        this.estructura = true;
        break;
      case 'dotacion':
        this.dotacion = true;
        break;
      case 'roster':
        this.roster = true;
        break;
      case 'marcaciones':
        this.marcaciones = true;
        break;

      default:
        break;
    }
  }

}
