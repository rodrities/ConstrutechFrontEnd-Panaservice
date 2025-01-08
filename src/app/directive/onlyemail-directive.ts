import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[emailOnly]'
})

export class OnlyemailDirective {
    constructor(private _el: ElementRef) { }
  
    @HostListener('input', ['$event']) onInputChange(event) {
      const initalValue = this._el.nativeElement.value;
  
      this._el.nativeElement.value = initalValue.replace(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, '');
      if ( initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
      const initalValue = this._el.nativeElement.value;
  
      this._el.nativeElement.value = initalValue.replace(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, '');
      if ( initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }
}