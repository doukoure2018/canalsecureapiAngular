import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { DetailcampaignComponent } from './detailcampaign/detailcampaign.component';
import { NewcampaignComponent } from './newcampaign/newcampaign.component';
import { CampaignRoutingModule } from './campaign-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [
    DetailcampaignComponent,
    NewcampaignComponent,
    BroadcastComponent,
  ],
  imports: [SharedModule, CampaignRoutingModule, NavbarModule, FooterModule],
})
export class CampaignModule {}
