import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNormalizeInput]',
})
export class NormalizeInput {
  constructor(private control:NgControl) { }

  @HostListener('blur') onBlur(){
    const value = this.control.control?.value;
    if(value){
      const NormalizeInput = value.toLowerCase().replace(/\s+/g,'');
      this.control.control?.setValue(NormalizeInput);
    }

  }

}
