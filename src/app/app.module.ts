import { CurrencyPipe, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaestroPersonalComponent } from './pages/maestros/maestroPersonal/maestro-personal/maestroPersonal.component';
import { PreRosterComponent } from './pages/rosters/pre-roster/pre-roster/pre-roster.component';
import { UsuariosComponent } from './pages/usuarios/usuarios/usuarios.component';
import { AtraccionTalentoComponent } from './pages/atraccion-talento/atraccion-talento/atraccion-talento.component';
import { ControlAsistenciaComponent } from './pages/control-asistencia/control-asistencia/control-asistencia.component';
import { VacantesComponent } from './pages/vacantes/vacantes/vacantes.component';

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    FullComponent
     
  ],
  imports: [
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe,
    CurrencyPipe
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang("es");
    this.translateService.use("es");
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
