import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavService {
  toggleActive: boolean = false;
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public toggleMenu(): void {
    this.appDrawer.toggle();
    /*this.toggleActive = !this.toggleActive;
    if (this.toggleActive) {
      this.appDrawer.close();
    } else {
      this.appDrawer.open();
    }*/
  }
}
