import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { encodeBase64 } from "bcryptjs";
import { RqAuthentication } from "src/app/shared/model/authentication-dto/rq.authentication";
import { ConstrutechService } from "src/app/shared/services/construtech.service";
import { UtilTools } from "src/app/shared/util/util-tools";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";
import { TokenData } from "src/app/shared/model/database-dto/tokenDTO";
import { LoginResponse } from "src/app/interfaces/LoginResponse";
import { RsAuthentication } from "src/app/shared/model/authentication-dto/rs.authentication";

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;

  //VARIABLES TEMPORALES DE ACCESO
  emailTemp: String = "ADMIN@gmail.com";
  passwordTemp: String = "123456";
  emailTempFelix: String = "felix.eche@gmail.com";
  passwordTempFelix: String = "1MRfa7ul1hf%";
  emailTempCesar: String = "cesar.nieto@gmail.com";
  passwordTempCesar: String = "O5rKmo31a#tZ";

  constructor(
    private router: Router,
    private translate: TranslateService,
    private utilTools: UtilTools,
    private service: ConstrutechService
  ) {}

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),
      ]),
      password: new FormControl("", [Validators.required]),
    });
  }

  public loginSession() {
    this.loginFormGroup.markAllAsTouched();

    if (this.loginFormGroup.valid) {
      this.utilTools.Timer();

      /*if ((this.emailTemp === this.loginFormGroup.controls['email'].value 
          && this.passwordTemp === this.loginFormGroup.controls['password'].value) || 
          (this.emailTempFelix === this.loginFormGroup.controls['email'].value 
          && this.passwordTempFelix === this.loginFormGroup.controls['password'].value) || 
          (this.emailTempCesar === this.loginFormGroup.controls['email'].value 
          && this.passwordTempCesar === this.loginFormGroup.controls['password'].value)) {
        this.utilTools.CloseTimer();
        sessionStorage.setItem("flagLogueo", "true");
        this.alert("success","Haz iniciado sesión con exito");
        this.router.navigate(["/inicio"])
      } else {
        this.utilTools.CloseTimer();
        this.alert("error","Data invalida");
      }*/

      sessionStorage.setItem("perfil", "perfilAux");
      sessionStorage.setItem("usuarioid", "1");
      sessionStorage.setItem("flagLogueo", "true");
      sessionStorage.setItem("rolid", "rolAux");
      this.alert("success", "Haz iniciado sesión con exito");
      this.router.navigate(["/inicio"]);

      /*let input = btoa(this.loginFormGroup.controls['email'].value + ":" + this.loginFormGroup.controls['password'].value + ":" + 2)
      this.service.authenticate(input).subscribe(
        (res: RsAuthentication) => {
          this.utilTools.CloseTimer();
          if (res.error !== "OK" && res.error !== undefined) {
            this.alert("error", res.error);
          } else {
            sessionStorage.setItem("token", res.data.accessToken);

            let tokenInfo: TokenData;
            tokenInfo = jwt_decode(res.data.accessToken);

            sessionStorage.setItem("perfil", tokenInfo.perfiles[0]);
            sessionStorage.setItem("usuarioid", tokenInfo.usuarioId);
            sessionStorage.setItem("flagLogueo", "true");
            sessionStorage.setItem("rolid" , res.data.persona.cargo.cargId.toString());
            this.alert("success","Haz iniciado sesión con exito");
            this.router.navigate(["/inicio"])
          }
          
        },
        error => {
          this.utilTools.CloseTimer();
          this.alert("error", error.error.error);
        }
      );*/
    }
  }

  public alert(tipo: any, error: string) {
    Swal.fire({
      type: tipo,
      title: "Login",
      html: error,
      confirmButtonColor: this.translate.instant("alert.alert_button_color"),
    });
  }
}
