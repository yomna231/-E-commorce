import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../../../shared/interface/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginData } from '../../../shared/interface/login-data';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthonService {
  pid = inject(PLATFORM_ID);
  _Route = inject(Router);
  isLogin: BehaviorSubject<boolean> = new BehaviorSubject(false);
  UsreName: BehaviorSubject<string> = new BehaviorSubject('');
  private _HttpClient = inject(HttpClient);


  constructor() {
    if (isPlatformBrowser(this.pid)) {
      if (localStorage.getItem('token') !== null) {
        this.doVerifyToken();
      } else {
        this._Route.navigate(['/login'])
      }

    }

  };






  VerifayToken(t: any): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/auth/verifyToken',
      {
        headers: { token: t },
      }
      );
  };


  doVerifyToken() {
    this.VerifayToken(localStorage.getItem('token')).subscribe({
      next: (res) => {
        if (res.message == 'verified') {
          this.isLogin.next(true);
          this.UsreName.next(res.decoded.name);
        }
      }, error: () => {
        this.isLogin.next(false);
        this._Route.navigate(['/login']);

      },
    });


  };

  singUp(userData: User): Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signup', userData);
  }

  singnIn(loginData: LoginData): Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signin', loginData);



  }


  ForgetPassword(email: string): Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', { email });
  }


  VerifyResetCode(resetCode: string): Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', { resetCode });
  }

  ResetPassword(email: string, newPassword: string): Observable<any> {
    return this._HttpClient.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', { email, newPassword }
    );
  }
}