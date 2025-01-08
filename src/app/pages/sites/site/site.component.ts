import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css',
  '../../../../assets/b4/css/bootstrap.min.css',
  '../../../../assets/font-awesome/css/font-awesome.min.css',
],
  encapsulation: ViewEncapsulation.Emulated
})
export class SiteComponent implements OnInit {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

    iconRegistry.addSvgIcon('thumbs-up', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/user.svg'));
  }

  ngOnInit() {
    sessionStorage.removeItem("flagLogueo");
  }

}
