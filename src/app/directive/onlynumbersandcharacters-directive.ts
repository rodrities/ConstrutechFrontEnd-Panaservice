import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersandcharactersOnly]'
})

export class OnlynumbersandcharactersDirective {

    constructor(private _el: ElementRef) { }
  
    @HostListener('input', ['$event']) onInputChange(event) {
      const initalValue = this._el.nativeElement.value.toUpperCase();
      this._el.nativeElement.value = initalValue.replace(/[^0-9S/.@ ]*/g, '');
      if ( initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }
}
