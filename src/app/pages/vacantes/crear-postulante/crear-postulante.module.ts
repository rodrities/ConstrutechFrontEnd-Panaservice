import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CrearPostulanteComponent } from "./crear-postulante/crear-postulante.component";

import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { ValidationsModule } from 'src/app/directive/validations/validations.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'; 
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CrearPostulanteRoutingModule } from './crear-postulante-routing.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    declarations: [CrearPostulanteComponent],
    imports: [
      CommonModule,
      CrearPostulanteRoutingModule,
      FlexModule,
      FormsModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatInputModule,
      MatTableModule,
      MatPaginatorModule,
      MatIconModule,
      MatCardModule,
      MatDividerModule,
      MatNativeDateModule,
      MatTabsModule,
      MatButtonModule,
      ValidationsModule,
      HttpClientModule,
      MatSortModule,
      MatSelectModule,
      MatDatepickerModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatDialogModule,
      MatAutocompleteModule,
      MatSlideToggleModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    ]
  })
  
  export class CrearPostulanteModule { }
  
  export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }