import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { customInterceptor } from './shared/interceptors/custom.interceptor';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { ConfirmationService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(withInterceptors([customInterceptor,errorInterceptor])), 
    provideAnimationsAsync(),
    provideToastr(),
    ConfirmationService
  ]
};
