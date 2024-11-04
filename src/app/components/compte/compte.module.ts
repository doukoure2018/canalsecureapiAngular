import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { ComptesComponent } from './comptes/comptes.component';
import { DetailCompteComponent } from './detail-compte/detail-compte.component';
import { NewCompteComponent } from './new-compte/new-compte.component';
import { CompteRoutingModule } from './compte-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [ComptesComponent, DetailCompteComponent, NewCompteComponent],
  imports: [SharedModule, CompteRoutingModule, NavbarModule, FooterModule],
})
export class CompteModule {}
