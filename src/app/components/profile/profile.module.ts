import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [SharedModule, ProfileRoutingModule, NavbarModule, FooterModule],
})
export class ProfileModule {}
