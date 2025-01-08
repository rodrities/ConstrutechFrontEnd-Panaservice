import { AfterViewInit, Component, ElementRef, HostListener, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GrupoOpcionDto } from './model/grupoOpcion-dto';
import { NavItem } from './model/nav-item';
import { NavService } from './service/nav.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterViewInit, OnInit {

  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;

  grupoOpciones: GrupoOpcionDto[];
  version = VERSION;
  options: FormGroup;
  navItems: NavItem[];

  constructor(fb: FormBuilder, private router: Router,
    private navService: NavService) {
  }

  loadMenu() {
    this.navItems = [];

    let navItem = {} as NavItem;
    navItem.displayName = "Gestor Maestro";
    navItem.iconName = "menu"

    let children: NavItem[];
    children = [];

    let itemChild8 = {} as NavItem;
    itemChild8.iconName = "home"
    itemChild8.displayName = "Inicio";
    itemChild8.route = "home";
    children.push(itemChild8);

    let itemChild4 = {} as NavItem;
    itemChild4.iconName = "account_circle"
    itemChild4.displayName = "Gestion de Usuarios";
    itemChild4.route = "usuarios";
    children.push(itemChild4);

    let itemChild6 = {} as NavItem;
    itemChild6.iconName = "supervisor_account"
    itemChild6.displayName = "Atracción de talento";
    itemChild6.route = "atraccion-talento";
    children.push(itemChild6);

    let itemChild9 = {} as NavItem;
    itemChild9.iconName = "add_circle"
    itemChild9.displayName = "Selección de Personal";
    itemChild9.route = "seleccion-incorporacion";
    children.push(itemChild9);

    let itemChild = {} as NavItem;
    itemChild.iconName = "folder"
    itemChild.displayName = "Estructura de Personal";
    itemChild.route = "master-de-personal";
    children.push(itemChild);

    let itemChild3 = {} as NavItem;
    itemChild3.iconName = "groups"
    itemChild3.displayName = "Dotacion de Personal";
    itemChild3.route = "dotacion";
    children.push(itemChild3);

    let itemChild2 = {} as NavItem;
    itemChild2.iconName = "calendar_month"
    itemChild2.displayName = "Roster";
    itemChild2.route = "pre-roster";
    children.push(itemChild2);

    let itemChild5 = {} as NavItem;
    itemChild5.iconName = "watch_later"
    itemChild5.displayName = "Reloj Control";
    itemChild5.route = "reloj-control";
    children.push(itemChild5);

    let itemChild7 = {} as NavItem;
    itemChild7.iconName = "check_circle"
    itemChild7.displayName = "Control de Asistencia";
    itemChild7.route = "control-asistencia";
    children.push(itemChild7);

    let itemChild10 = {} as NavItem;
    itemChild10.iconName = "groups"
    itemChild10.displayName = "Vacantes";
    itemChild10.route = "vacantes";
    children.push(itemChild10);

    // let itemChild8 = {} as NavItem;
    // itemChild8.iconName = "insert_chart_outlined"
    // itemChild8.displayName = "Dashboard";
    // itemChild8.route = "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Panel-Gerencial.aspx";
    // children.push(itemChild8);
    
    navItem.children = children;
    this.navItems.push(navItem);
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.sidenav;
    this.loadMenu();
  }

  ngOnInit() {
    this.loadMenu();
  }

  logout(): void {
    this.router.navigate(['/authentication']);
  }
}
