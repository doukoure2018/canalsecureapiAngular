import { NgModule } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { UserService } from '../services/user.service';
import { CampaignService } from '../services/campaign.service';
import { HttpCacheService } from '../services/http.cache.service';
import { NotificationService } from '../services/notification.service';

@NgModule({
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    [
      // Import others services as well
      UserService,
      CampaignService,
      HttpCacheService,
      NotificationService,
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
      provideAnimationsAsync(),
    ],
  ],
})
export class CoreModule {}
