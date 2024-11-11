import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './services/API/auth.service';
import { authInterceptor } from './interceptor/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DeviceService } from './services/device.service';
import { ScrumPokerService } from './services/scrum-poker.service';
import { SortStoriesPipe } from './pipes/sort-stories.pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    AuthService,
    DeviceService,
    SortStoriesPipe,
    ScrumPokerService,
    provideAnimationsAsync(),
  ],
};