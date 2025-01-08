import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { LoginComponent } from "../pages/authentication/login/login.component";
import { ConstrutechService } from "../shared/services/construtech.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: ConstrutechService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticate()) {
      console.log("Usuario autenticado");
      return true;
    } else {
      console.log("Usuario autenticado");
      return true;
      /*console.log("Usuario no autenticado, redirigiendo...");
            this.router.navigate(['/authentication']);
            return false;*/
    }
  }
}
