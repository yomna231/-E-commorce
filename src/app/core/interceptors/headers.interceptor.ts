import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const MyToken = localStorage.getItem('token');

    if (MyToken) {
      // console.log('Attaching token to request:', MyToken);
      const updateReq = req.clone({
        setHeaders: { token: MyToken },
      });
      return next(updateReq);
    }
  }

  return next(req);
};
