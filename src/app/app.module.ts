import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VerifyComponent } from './components/verify/verify.component';
import { HomeComponent } from './components/home/home.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ComptesComponent } from './components/comptes/comptes.component';
import { DetailCompteComponent } from './components/detail-compte/detail-compte.component';
import { NewCompteComponent } from './components/new-compte/new-compte.component';
import { StatsComponent } from './components/stats/stats.component';
import { DetailcampaignComponent } from './components/detailcampaign/detailcampaign.component';
import { NewcampaignComponent } from './components/newcampaign/newcampaign.component';
import { ExpirationStatusPipe } from './pipes/expirationStatus';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { FooterComponent } from './components/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './modules/material/material.module';

@NgModule({
  declarations: [
    ExpirationStatusPipe,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetpasswordComponent,
    ProfileComponent,
    VerifyComponent,
    HomeComponent,
    NavbarComponent,
    ComptesComponent,
    DetailCompteComponent,
    NewCompteComponent,
    StatsComponent,
    DetailcampaignComponent,
    NewcampaignComponent,
    BroadcastComponent,
    FooterComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, MaterialModule],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    [
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },

      provideAnimationsAsync(),
    ],
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
