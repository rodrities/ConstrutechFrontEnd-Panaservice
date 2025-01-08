
  import { Directive, ElementRef, HostListener } from '@angular/core';

  @Directive({
    selector: '[Uppercase]'
  })

export class UppercaseDirective {

  constructor(private _el: ElementRef) { }
  
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value.toUpperCase();
    this._el.nativeElement.value = initalValue;
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
