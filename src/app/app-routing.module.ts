import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VerifyComponent } from './components/verify/verify.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { DetailCompteComponent } from './components/detail-compte/detail-compte.component';
import { ComptesComponent } from './components/comptes/comptes.component';
import { NewCompteComponent } from './components/new-compte/new-compte.component';
import { DetailcampaignComponent } from './components/detailcampaign/detailcampaign.component';
import { NewcampaignComponent } from './components/newcampaign/newcampaign.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';

const routes: Routes = [
  // the use does need to log with these routes
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'resetpassword',
    component: ResetpasswordComponent,
  },
  {
    path: 'auth/secureapi/verify/account/:key',
    component: VerifyComponent,
  },
  {
    path: 'auth/secureapi/verify/password/:key',
    component: VerifyComponent,
  },

  // the user needs to get logged
  {
    path: 'comptes',
    component: ComptesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'comptes/new',
    component: NewCompteComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'comptes/:id',
    component: DetailCompteComponent,
    canActivate: [AuthenticationGuard],
  },
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

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },

  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
