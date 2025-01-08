import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[lettersOnly]'
})

export class OnlylettersDirective {

    constructor(private _el: ElementRef) { }
  
    key;
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
      this.key = event.keyCode; 
      //console.log("presiono =><" + this.key)
      if(this.key !=32 && this.key !=192 && this.key !=186){
        if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
          event.preventDefault();
        }
      }
    }

    @HostListener('input', ['$event']) onInputChange(event) {
      const initalValue = this._el.nativeElement.value;
      this._el.nativeElement.value = initalValue.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ. \-s]*/g, '');
      if ( initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }

}
