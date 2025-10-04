import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// تعريف متغيرات global للسيرفر
declare global {
  // Extend the NodeJS.Global interface to include 'util'
  // If using typescript < 4.5, use 'namespace NodeJS { interface Global { ... } }'
  // Otherwise, extend globalThis directly
  var util: {
    inherits: (ctor: any, superCtor: any) => void;
  };
}

if (typeof global !== 'undefined') {
  if (!global.process) {
    global.process = {} as any;
  }
  if (!global.process.env) {
    global.process.env = {} as any;
  }
  global.process.env['DEBUG_MIME'] = 'false';
  global.process.env['NODE_ENV'] = 'production';
  
  global.util = {
    inherits: function(ctor: any, superCtor: any) {
      Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    }
  };
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    {
      provide: 'SERVER_SIDE',
      useValue: true
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);