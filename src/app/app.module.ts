import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './components/auth/auth.module';
import { CampaignModule } from './components/campaign/campaign.module';
import { CompteModule } from './components/compte/compte.module';
import { ProfileModule } from './components/profile/profile.module';
import { HomeModule } from './components/home/home.module';
import { StatsModule } from './components/stats/stats.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AuthModule,
    CampaignModule,
    CompteModule,
    ProfileModule,
    HomeModule,
    StatsModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
