import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { Routes, RouterModule } from "@angular/router";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ValidationsModule } from "src/app/directive/validations/validations.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CrearDotacionComponent } from "./crear-dotacion/crear-dotacion.component";

const routes: Routes = [
    {
      path: '',
      component: CrearDotacionComponent,
      data: {
        title: 'Dotacion Personal',
        description: 'V.1.0.0',
        urls: [
          { title: 'Dotacion Personal', url: '/crear-master-de-personal', icon: 'home' },
          { title: 'dotacion' }
        ]
      }
    }
  ];
  
  @NgModule({
    declarations: [],
    imports: [
      RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
  })
  export class CrearDotacionRoutingModule { }
  
  export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }