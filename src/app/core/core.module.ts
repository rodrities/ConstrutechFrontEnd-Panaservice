import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeadermenuComponent } from './components/header/headermenu/headermenu.component';
import { MenuListItemComponent } from './components/menu/menu-list-item/menu-list-item.component';
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormComponent } from './components/form/form/form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    SettingsComponent,
    FooterComponent,
    MenuListItemComponent,
    HeadermenuComponent,
    FormComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule,
    MatExpansionModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatInputModule,
    MatBadgeModule

  ],

  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    SettingsComponent
  ],
  providers: [

  ],

})
export class CoreModule {
  constructor(injector: Injector) {

  }
}
