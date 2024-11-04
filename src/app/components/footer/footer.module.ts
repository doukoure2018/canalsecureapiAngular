import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [SharedModule],
  exports: [FooterComponent],
})
export class FooterModule {}
