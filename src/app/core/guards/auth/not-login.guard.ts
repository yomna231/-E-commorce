import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthonService } from '../../services/authontication/authon.service';

export const notLoginGuard: CanActivateFn = (route, state) => {
  let _AuthonService = inject(AuthonService);

  let _router = inject(Router);

  //  if(_AuthonService.isLogin.value === false){
  if (localStorage.getItem('token')) {
    _router.navigate(['/home']);
    return false;
  } else {
    return true;
  }
};
