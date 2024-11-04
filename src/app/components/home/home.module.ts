import { NgModule } from '@angular/core';
import { SharedModule } from '../../share/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { StatsModule } from '../stats/stats.module';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
    NavbarModule,
    StatsModule,
    FooterModule,
  ],
})
export class HomeModule {}
