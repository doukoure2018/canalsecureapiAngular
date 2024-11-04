import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  declarations: [NavbarComponent],
  imports: [SharedModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
