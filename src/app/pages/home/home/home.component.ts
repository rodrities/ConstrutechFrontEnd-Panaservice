import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BnNgIdleService } from "bn-ng-idle";
import { Router } from "@angular/router";
import { ConstrutechService } from "src/app/shared/services/construtech.service";
import { FiltroDTO } from "src/app/shared/model/filtroDTO";
import { PlanillaUsuarioDTO } from "src/app/shared/model/database-dto/planillaUsuarioDTO";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [
    "./home.component.css",
    "../../../../assets/b4/css/bootstrap.min.css",
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class HomeComponent implements OnInit {
  objetoPlanillaUsuario: PlanillaUsuarioDTO[] = [];
  isDisabled: boolean = true;

  constructor(
    private bnIdle: BnNgIdleService,
    private router: Router,
    private service: ConstrutechService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.router.navigate(["/inicio"]);
    //this.getIdPlanilla();
  }

  validateUrlByCargId(): string {
    switch (sessionStorage.getItem("rolid")) {
      case "1":
        return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Panel-Gerencial.aspx";
      case "114":
        return this.validateByUserId();
      default:
        return this.validateByUserPlanilla();
    }
  }

  getIdPlanilla(): void {
    let filtro = new FiltroDTO();
    filtro.filterUsuId = Number(sessionStorage.getItem("usuarioid"));

    this.service
      .getPlanillaUsuarioPorUserId(filtro)
      .subscribe((res: PlanillaUsuarioDTO[]) => {
        this.objetoPlanillaUsuario = res;
        this.isDisabled = false;
      });
  }

  validateByUserId() {
    switch (sessionStorage.getItem("usuarioid")) {
      case "39":
        return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/JO--Alberto-Gamboa.aspx";
      case "42":
        return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/JO--Paolo-Vizquerra.aspx";
      case "29":
        return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/JO--Julio-Contreras.aspx";
      default:
        break;
    }
  }

  validateByUserPlanilla() {
    const mapaDePlanIds = new Map();
    const resultado: PlanillaUsuarioDTO[] = [];

    if (this.objetoPlanillaUsuario.length > 0) {
      for (const objeto of this.objetoPlanillaUsuario) {
        if (!mapaDePlanIds.has(objeto.planId)) {
          mapaDePlanIds.set(objeto.planId, true);
          resultado.push(objeto);
        }
      }

      if (resultado.length > 7) {
        return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Panel-Gerencial.aspx";
      } else {
        switch (resultado[0].planId.toString()) {
          case "14":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Cori-Puno.aspx";
          case "17":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Horizonte.aspx";
          case "41":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Yauli.aspx";
          case "42":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Yauli.aspx";
          case "43":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Yauli.aspx";
          case "12":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Chungar.aspx";
          case "6":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Chungar.aspx";
          case "10":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/CDA.aspx";
          case "26":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/CDA.aspx";
          case "21":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Lincuna.aspx";
          case "9":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Bateas.aspx";
          case "23":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Paragsha.aspx";
          case "24":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Paragsha.aspx";
          case "5":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Andaychagua.aspx";
          case "4":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Alpamarca.aspx";
          case "13":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Colquisiri.aspx";
          case "20":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Kall.aspx";
          case "8":
            return "https://panaserviceperu.sharepoint.com/sites/PlataformaGTH/SitePages/Ba%C3%B1os-V.aspx";
          default:
            break;
        }
      }
    }
  }
}
