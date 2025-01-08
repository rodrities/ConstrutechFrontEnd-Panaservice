import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersandlettersOnly]'
})

export class OnlynumberandlettersDirective {

    constructor(private _el: ElementRef) { }
  
    @HostListener('input', ['$event']) onInputChange(event) {
      const initalValue = this._el.nativeElement.value.toUpperCase();
      this._el.nativeElement.value = initalValue.replace(/[^0-9a-zA-ZñÑ_.\- ]*/g, '');
      if ( initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }
}
