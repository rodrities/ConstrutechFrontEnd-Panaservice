import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { GrupoOpcionDto } from 'src/app/core/components/menu/model/grupoOpcion-dto';
import { EventService } from '../shared/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  grupoOpciones: GrupoOpcionDto[] = []
  constructor(
    private event:EventService,) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if (state.url == '/site' || state.url == '/authentication') {
      
     
      if (sessionStorage.getItem("flagLogueo") === "true") {
        return false;
      }
      
      this.event.changeStyle.emit('temaConstrutech');

    }


    else{
      this.event.changeStyle.emit('temaConstrutech');
      return true
  
    
    }
    return true;
  }
}
