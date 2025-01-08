import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PersonaDTO } from 'src/app/shared/model/database-dto/personaDTO';
import { PostulanteDTO } from 'src/app/shared/model/database-dto/postulanteDTO';
import { PostulanteRequestDTO } from 'src/app/shared/model/database-dto/postulanteRequestDTO';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';

@Component({
  selector: 'app-crear-postulante',
  templateUrl: './crear-postulante.component.html',
  styleUrls: ['./crear-postulante.component.css']
})
export class CrearPostulanteComponent implements OnInit {

  experienciaTiempo = [
    "Años" , "Meses" , "Sin experiencia"
  ];

  gradoAcademico = [
    "Técnico", "Técnico Incompleto", "Universitario", "Titulado", "Titulado y Colegiado", "Bachiller", "Egresado Universidad", "Secundaria Completa",  "Secundaria Incompleta"
  ]
  
  disponibilidad = [
    "Inmediata", "Menor a 10 días", "10 a 15 días", "15 días a más", "No Disponible"
  ]

  experienciaMina = [
    "Menor a 3000 mnsm", "Mayor a 3000 mnsm"
  ]

  @ViewChild('crearPostulanteForm') crearUsuarioForm: NgForm;
  postulanteRequest = new PostulanteRequestDTO();
  postulante = new PostulanteDTO();
  experiencia = ["", ""]
  experienciaFuncional = ["", ""]
  date = new Date();
  isTrue: boolean = false;
  constructor(private datePipe: DatePipe,
    private router: Router,
    private service: ConstrutechService,) { }
  isChecked = true;
  ngOnInit(): void {
   this.postulanteRequest.vacdReingreso = false
   this.postulante.postTieneExperienciaCampMina = false
   this.postulante.postTieneExperienciaRubro = false
  }


  crearPostulante() {

    this.postulante.postExperiencia = this.experiencia[0] + " " + this.experiencia[1]
    this.postulante.postExperienciaFuncional = this.experienciaFuncional[0] + " " + this.experienciaFuncional[1]
    /*if (this.experiencia[1] === "Meses") this.postulante.postExperienciaRango = "< 1 año"
    else if (this.experiencia[1] === "Años"){
      if (this.experiencia[0] > 2) {

      }
    }*/

    this.postulante.postFeNacimiento = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.postulanteRequest.postulante = this.postulante;
    this.postulanteRequest.vacId = Number(sessionStorage.getItem("vacante"));

    
    
    console.log(this.postulanteRequest)

    this.service.createPostulante(this.postulanteRequest).subscribe( res => {
      console.log(res)
      this.router.navigate(['/vacantes'])
    })
    
  }
}
