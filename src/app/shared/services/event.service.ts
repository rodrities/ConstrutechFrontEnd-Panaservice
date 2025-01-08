import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /*BORRAR VARIABLES QUE NO USES*/
  
  @Output() rutaEvent: EventEmitter<any> = new EventEmitter();
  /*cambiar nombre, no describe el evento*/
  @Output() cliente: EventEmitter<any> = new EventEmitter();
  @Output() changeStyle: EventEmitter<string> = new EventEmitter();
  @Output() cerrarSesion: EventEmitter<boolean> = new EventEmitter();
  constructor() { }


}
