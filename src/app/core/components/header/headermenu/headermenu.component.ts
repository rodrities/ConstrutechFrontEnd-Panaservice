import { Component, Input } from "@angular/core";
import { MatMenu } from "@angular/material/menu";
import { Router } from "@angular/router";
import { EventService } from "src/app/shared/services/event.service";

@Component({
  selector: "app-headermenu",
  templateUrl: "./headermenu.component.html",
  styleUrls: ['./headermenu.component.css']
})
export class HeadermenuComponent{
  @Input() data: any[] = [];
  @Input() trigger;
  @Input() isRootNode = false;

  constructor
  (
    private event:EventService,
    public router: Router
  ){}

  getData(node: any) {
    this.data = node.children;
  }

  isExpandable(node: any) {
    const rpta = (!node.children || !node.children.length);
    return !rpta;
  }

  onItemSelected(item: any) {
    if (!this.isExpandable(item)) {
      // console.log(item.route)
      this.router.navigate([item.route]);
      this.event.rutaEvent.emit(item.route);
    }
  }

  logout(): void {
    sessionStorage.removeItem("flagLogueo");
    this.router.navigate(['/authentication']);
  }

}
