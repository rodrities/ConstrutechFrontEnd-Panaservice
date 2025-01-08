import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})

export class UtilTools {
  ruta: string;

  /*TImer varibles*/
  timeLeft: number = 1;
  interval;

  constructor(public router: Router,
    private matSnackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) { }

  warning(msg: string) {
    Swal.fire({
      type: 'warning',
      title: this.translate.instant('consultaBiometrica.slide1_text'),
      text: msg,
      confirmButtonColor: this.translate.instant('alert.alert_button_color'),
      confirmButtonText: this.translate.instant('alert.alert_ok'),
      allowOutsideClick: false
    });
  }

  error(title: string, msg: string) {
    Swal.fire({
      type: 'error',
      title: title,
      text: msg,
      confirmButtonColor: this.translate.instant('alert.alert_button_color'),
      confirmButtonText: this.translate.instant('alert.alert_ok'),
      allowOutsideClick: false
    }
    );
  }

  alert(tipo: any, _title: string, msg: string, buttoncolor: string, buttontext: string) {
    Swal.fire({
      type: tipo,
      title: _title,
      text: msg,
      confirmButtonColor: buttoncolor,
      confirmButtonText: buttontext,
      allowOutsideClick: false
    });
  }

  public snackBarAlert() {
    this.matSnackBar.open('Si tienes problemas, contactar al área responsable I+D ( Angela Salas, Fiorella Pariocoto, Zorayda Carrasco ) 084-606161*1720.', 'CAJA CUSCO', {
      duration: 5000
    });
  }

  public Timer = () => {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.spinner.show();
        clearInterval(this.interval);
        this.interval = 0;
        this.timeLeft = 1;
      }
    }, 300);
  }

  public CloseTimer = () => {
    clearInterval(this.interval);
    this.interval = 0;
    this.timeLeft = 1;
    this.spinner.hide();
  }

  public b64toBlob(b64Data, contentType, sliceSize) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

/*   public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return <File>theBlob;
  } */



  public generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }
}
