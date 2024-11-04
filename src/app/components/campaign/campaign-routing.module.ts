import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guard/authentication.guard';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { DetailcampaignComponent } from './detailcampaign/detailcampaign.component';
import { NewcampaignComponent } from './newcampaign/newcampaign.component';

const campaignRoutes: Routes = [
  {
    path: 'campaigns/new',
    component: NewcampaignComponent,
    canActivate: [AuthenticationGuard],
  },
  // Broadcast message component
  {
    path: 'campaigns/broadcast/:campaignId/:userId',
    component: BroadcastComponent,
    canActivate: [AuthenticationGuard],
  },
  // unicast message component
  {
    path: 'campaigns/:campaignId/:userId',
    component: DetailcampaignComponent,
    canActivate: [AuthenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(campaignRoutes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}
