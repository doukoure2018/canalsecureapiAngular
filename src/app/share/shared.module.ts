import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ExpirationStatusPipe } from '../pipes/expirationStatus';
import { MaterialModule } from '../modules/material/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ExpirationStatusPipe],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [
    CommonModule,
    RouterModule, // for all the router in the app
    FormsModule,
    MaterialModule,
    ExpirationStatusPipe,
  ],
})
export class SharedModule {}
