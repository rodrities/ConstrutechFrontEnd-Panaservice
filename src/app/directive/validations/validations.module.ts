import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OnlylettersDirective } from 'src/app/directive/onlyletters-directive';
import { OnlynumberandlettersDirective } from 'src/app/directive/onlylettersandnumbers-directive';
import { OnlynumberDirective } from 'src/app/directive/onlynumber-directive';
import { OnlyemailDirective } from '../onlyemail-directive';
import { OnlynumbersandcharactersDirective } from '../onlynumbersandcharacters-directive';
import { UppercaseDirective } from '../uppercase-directive';


@NgModule({
  declarations: [
    OnlynumberDirective, 
    OnlynumberandlettersDirective, 
    OnlynumbersandcharactersDirective, 
    OnlylettersDirective,
    OnlyemailDirective, 
    UppercaseDirective],
  imports: [CommonModule],
  exports: [
    OnlynumberDirective, 
    OnlynumberandlettersDirective, 
    OnlynumbersandcharactersDirective, 
    OnlylettersDirective, 
    OnlyemailDirective,
    UppercaseDirective]
})
export class ValidationsModule { }
