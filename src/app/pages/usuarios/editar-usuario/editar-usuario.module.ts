import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexModule } from "@angular/flex-layout";
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
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ValidationsModule } from "src/app/directive/validations/validations.module";
import { EditarUsuarioRoutingModule } from "./editar-usuario-routing.module";
import { EditarUsuarioComponent } from "./editar-usuario/editar-usuario.component";

@NgModule({
    declarations: [ EditarUsuarioComponent],
    imports: [
      CommonModule,
      EditarUsuarioRoutingModule,
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
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    ]
  })
  
  export class EditarUsuarioModule { }
  
  export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }