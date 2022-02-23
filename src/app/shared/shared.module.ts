import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StarComponent } from './star.component';
import { ConvertToSlash } from './convert-to-spaces.pipe';

@NgModule({
  declarations: [
    StarComponent, 
    ConvertToSlash
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StarComponent,
    FormsModule,
    CommonModule,
    ConvertToSlash
  ]
})
export class SharedModule { }
