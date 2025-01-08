import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticactionRoutingModule } from './authenticaction-routing.module';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthenticactionRoutingModule,
  ]
})
export class AuthenticationModule {
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang("es");
    this.translateService.use("es");
  }
 }
