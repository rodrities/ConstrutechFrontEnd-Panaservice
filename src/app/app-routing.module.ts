import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guard/role.guard';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [

  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        redirectTo: 'authentication',
        pathMatch: 'full'
      },
      {
        path: 'authentication', loadChildren: './pages/authentication/authentication.module#AuthenticationModule',
        canActivate: [RoleGuard]
      },
    ]
  }, {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio', loadChildren: './pages/home/home.module#HomeModule',
        canActivate: [RoleGuard, AuthGuard]
      },
      //PERSONAL
      {
        path: 'dotacion', loadChildren: './pages/maestros/maestroPersonal/maestroPersonal.module#MaestroPersonalModule', canActivate: [AuthGuard]
      },
      {
        path: 'master-de-personal', loadChildren: './pages/maestros/maestroPersonal/dotacion-personal/dotacion-personal.module#DotacionPersonalModule', canActivate: [AuthGuard]
      },
      {
        path: 'crear-master-de-personal', loadChildren: './pages/maestros/maestroPersonal/crear-dotacion/crear-dotacion.module#CrearDotacionModule', canActivate: [AuthGuard]
      },
      //ROSTER
      {
        path: 'roster', loadChildren: './pages/rosters/roster/roster.module#RosterModule', canActivate: [AuthGuard]
      },
      {
        path: 'pre-roster', loadChildren: './pages/rosters/pre-roster/pre-roster.module#PreRosterModule', canActivate: [AuthGuard]
      },
      //USUARIOS
      {
        path: 'usuarios', loadChildren: './pages/usuarios/usuarios.module#UsuariosModule', canActivate: [AuthGuard]
      },
      {
        path: 'crear-usuario', loadChildren: './pages/usuarios/crear-usuario/crear-usuario.module#CrearUsuarioModule', canActivate: [AuthGuard]
      },
      {
        path: 'editar-usuario/:id', loadChildren: './pages/usuarios/editar-usuario/editar-usuario.module#EditarUsuarioModule', canActivate: [AuthGuard]
      //RELOJ CONTROL
      },
      {
        path: 'reloj-control', loadChildren: './pages/reloj/reloj-control/reloj-control.module#RelojControlModule', canActivate: [AuthGuard]
      },
      //ATRACCION DE TALENTO
      {
        path: 'atraccion-talento', loadChildren: './pages/atraccion-talento/atraccion-talento.module#AtraccionTalentoModule', canActivate: [AuthGuard]
      },
      //CONTROL DE ASISTENCIA
      {
        path: 'control-asistencia',
        loadChildren: './pages/control-asistencia/control-asistencia.module#ControlAsistenciaModule', canActivate: [AuthGuard]
      },
      {
        path: 'control-asistencia/ver-marcaciones',
        loadChildren: './pages/control-asistencia/control-asistencia/ver-marcaciones/ver-marcaciones.module#VerMarcacionesModule', canActivate: [AuthGuard]
      },
      {
        path: 'seleccion-incorporacion', loadChildren: './pages/seleccion/seleccion.module#SeleccionModule', canActivate: [AuthGuard]
      },
      //VACANTES
      {
        path: 'vacantes', loadChildren: './pages/vacantes/vacantes.module#VacantesModule', canActivate: [AuthGuard]
      },
      {
        path: 'vacanteDetalle/:vacanteId/:planillaId', loadChildren: './pages/vacantes/vacante-detalle/vacante-detalle.module#VacanteDetalleModule', canActivate: [AuthGuard]
      },
      {
        path: 'crear-postulante', loadChildren: './pages/vacantes/crear-postulante/crear-postulante.module#CrearPostulanteModule', canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
