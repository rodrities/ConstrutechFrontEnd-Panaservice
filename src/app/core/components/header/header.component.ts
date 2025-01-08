import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { EventService } from 'src/app/shared/services/event.service';
import { NavItem } from '../menu/model/nav-item';
import { NavService } from '../menu/service/nav.service';
import { ConstrutechService } from 'src/app/shared/services/construtech.service';
import SockJS from 'sockjs-client';
import { Stomp, Client, Message } from '@stomp/stompjs';
import { NotificacionDTO } from 'src/app/shared/model/database-dto/notificacionDTO';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('notificationSound') notificationSound: any;
  azure: string;
  flagLogueo: boolean = false;
  username;
  navItems: NavItem[];
  notificaciones: NotificacionDTO[] = []; // Un array para almacenar las notificaciones

  constructor(private router: Router,
    public navService: NavService,
    private event: EventService,
    private service: ConstrutechService
  ) {

  }
  toggleActive = false;

  ngOnInit() {

    if (sessionStorage.getItem("flagLogueo") == null) {
      this.flagLogueo = false
    } else {
      this.flagLogueo = !!sessionStorage.getItem("flagLogueo");
    }

    this.getUsuario()

    this.configureWebSocketConnection();
    this.buscarNotificaciones();
  }

  configureWebSocketConnection() {
    const socket = new SockJS(environment.urlAddress + '/ws');
    const stompClient = Stomp.over(socket);

    let totalNotificacionsAnterior: number = this.notificaciones.length;

    stompClient.connect({}, (frame) => {
      console.log('Conexión establecida: ' + frame);

      stompClient.subscribe('/topic/notificaciones', (message) => {
        this.buscarNotificaciones();

        if (this.notificaciones.length > totalNotificacionsAnterior) {
          const notificacion = JSON.parse(message.body);
          console.log('Notificación recibida: ', notificacion);
          this.notificaciones.push(notificacion);
          this.notificationSound.nativeElement.play();
        }
      });
    });

  }

  logout(): void {
    this.flagLogueo = false;
    sessionStorage.clear()
    this.router.navigate(['/authentication']);
    this.event.rutaEvent.emit('/authentication');
  }

  private getUsuario() {
    /*this.service.getUsuario(sessionStorage.getItem('token'), sessionStorage.getItem("username"))
      .subscribe(
        r => {
          sessionStorage.setItem("rol", r.rol.toString())
          this.loadMenu()
        }
      )*/

    this.loadMenu()
  }

  private loadMenu() {
    this.navItems = [];

    let navItem = {} as NavItem;
    navItem.displayName = "Gestor Maestro";

    let children: NavItem[];
    children = [];

    let itemChild = {} as NavItem;
    itemChild.iconName = "person"
    itemChild.displayName = "Estructura de Personal";
    itemChild.route = "personal";
    children.push(itemChild);

    navItem.children = children;
    this.navItems.push(navItem);

    // console.log(sessionStorage.getItem("rol"))

    /*if (+sessionStorage.getItem("rol") === 1) {
      //STANDS
      navItem = {} as NavItem;
      navItem.displayName = "Gestión de Stands";

      children = [];

      itemChild = {} as NavItem;
      itemChild.iconName = "manage_accounts"
      itemChild.displayName = "Stands";
      itemChild.route = "stand";
      children.push(itemChild);

      navItem.children = children;
      this.navItems.push(navItem);
      
      //USUARIOS
      navItem = {} as NavItem;
      navItem.displayName = "Gestión de Usuarios";

      children = [];

      itemChild = {} as NavItem;
      itemChild.iconName = "manage_accounts"
      itemChild.displayName = "Usuarios";
      itemChild.route = "usuario";
      children.push(itemChild);

      navItem.children = children;
      this.navItems.push(navItem);

      //REPORTERIA
      navItem = {} as NavItem;
      navItem.displayName = "Módulo de Consulta";

      children = [];

      itemChild = {} as NavItem;
      itemChild.iconName = "assignment"
      itemChild.displayName = "Puestos Vendidos";
      itemChild.route = "venta";
      children.push(itemChild);

      navItem.children = children;
      this.navItems.push(navItem);
    }*/
  }

  buscarNotificaciones() {
    this.service.searchNotificaciones(Number(sessionStorage.getItem("usuarioid"))).subscribe(
      (resp: NotificacionDTO[]) => {
        this.notificaciones = resp
      }
    )
  }

  onItemClick(notificacion: any) {
    sessionStorage.setItem("dotacion", notificacion)
    if (this.router.url.includes('/master-de-personal')) {
      location.reload();
    } else {
      this.router.navigate(['../master-de-personal']);
    }
  }



}
