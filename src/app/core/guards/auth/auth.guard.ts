import { isPlatformBrowser } from '@angular/common';
import { AuthonService } from './../../services/authontication/authon.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, EMPTY, first, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let _AuthonService = inject(AuthonService);
  let _router = inject(Router);
  let pid = inject(PLATFORM_ID);

  if (isPlatformBrowser(pid)) {
    return _AuthonService.VerifayToken(localStorage.getItem('token')).pipe(
      first(),
      map((res) => {
        if (res.message === 'verified') {
          _AuthonService.isLogin.next(true);
          return true;
        } else {
          _AuthonService.isLogin.next(false);
          _router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('authGurd error:', error);
        _AuthonService.isLogin.next(false);
        _router.navigate(['login']);
        return of(false);
      })
    );
  } else {
    return true;
  }
};
