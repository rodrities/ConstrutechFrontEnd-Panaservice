import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from 'src/app/shared/services/event.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'construtech';
  cssUrl;
  temaEstado : boolean  = true;
  constructor(
    public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.cssUrl = this.sanitizer.bypassSecurityTrustResourceUrl('./assets/styles/temaConstrutech.css');
  }
}
