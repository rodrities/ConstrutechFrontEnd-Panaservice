import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesRoutingModule } from './sites-routing.module';
import { TranslateService } from '@ngx-translate/core';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SitesRoutingModule
  ]
})
export class SitesModule {
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang("es");
    this.translateService.use("es");
  }
 }
