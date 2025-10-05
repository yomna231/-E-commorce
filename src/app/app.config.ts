import {
  ApplicationConfig,
  provideZoneChangeDetection,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { loaddingInterceptor } from './core/interceptors/loadding.interceptor';
import { headersInterceptor } from './core/interceptors/headers.interceptor';
import { errorsInterceptor } from './core/interceptors/errors.interceptor';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,withHashLocation()),
    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withFetch(),
      withInterceptors([
        headersInterceptor,
        errorsInterceptor,
        loaddingInterceptor,
      ])
    ),

    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      closeButton: true,
      toastClass: 'my-toast',
      iconClasses: {
        success: 'success-bg',
        error: 'error-bg',
      },
    }),

    provideTranslateService({
        loader: provideTranslateHttpLoader({prefix:'./i18n/', suffix:'.json'}),
      fallbackLang: 'en',
    }),

    {
      provide: 'APP_INITIALIZER',
      useFactory: (platformId: Object) => () => {
        if (isPlatformBrowser(platformId)) {
          (window as any).process = {
            env: {
              DEBUG_MIME: 'false',
              NODE_ENV: 'development',
            },
          };

          (window as any).util = {
            inherits: (ctor: any, superCtor: any) => {
              ctor.super_ = superCtor;
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true,
                },
              });
            },
          };
        }

        if (typeof global !== 'undefined') {
          if (!global.process) {
            global.process = {} as any;
          }
          global.process.env = {
            ...global.process.env,
            DEBUG_MIME: 'false',
            NODE_ENV: 'production',
          };
        }
      },
      deps: [PLATFORM_ID],
      multi: true,
    },
  ],
};
