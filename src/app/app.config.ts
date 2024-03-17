import { ApplicationConfig } from '@angular/core';
import { ExtraOptions, provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { cancelSameRequestInterceptor } from '@interceptors/cancel-same-request.interceptor';
import { jwtTokenInterceptor } from '@interceptors/jwt-token.interceptor';
import { requestInterceptor } from '@interceptors/request.interceptor';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, 'assets/i18n/', '.json');
const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
  enableTracing: false,
  scrollPositionRestoration: 'enabled'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig(routerOptions)
    ),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({  // Toastr providers
      timeOut: 6000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: false
    }),
    provideHttpClient(withInterceptors([
      requestInterceptor,
      cancelSameRequestInterceptor,
      jwtTokenInterceptor
    ])),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers!
  ]
};
