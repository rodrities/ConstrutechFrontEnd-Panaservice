import { AbstractControl } from '@angular/forms';

export function adapterValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = control.value==='-1';
    return valid ? { invalidAdapter: { valid: false, value: control.value }}: null ;
}
