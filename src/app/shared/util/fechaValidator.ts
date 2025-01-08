import { AbstractControl } from "@angular/forms";
import * as moment from "moment";

export class FechaValidation {
    static FechaValidation(AC: AbstractControl): any {

        const fechaInicio = moment(new Date(AC.get('fechaInicio').value));
        const fechaFin = moment(new Date(AC.get('fechaFin').value));

        if(fechaInicio > fechaFin) {
            AC.get('fechaFin').setValue('');
        }

        /*if(fechaFin.diff(fechaInicio, 'days') > 7) {
            console.log(true);
            console.log(fechaFin.diff(fechaInicio, 'days'));
            AC.get('fechaInicio').setErrors({'FechaValidation': true});
        } else {
            console.log(false);
            console.log(fechaFin.diff(fechaInicio, 'days'));
            return null;
        } */
    }
}