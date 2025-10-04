import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, inject } from '@angular/core';
import { AuthonService } from '../../../core/services/authontication/authon.service';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z].{6,15}$/),
    ]),
  });

  _AuthonService = inject(AuthonService);
   _Translate = inject(TranslateService);
  _ToastrService = inject(ToastrService);
    translationService=inject(MytranslationService)


  _router = inject(Router);
  isError: boolean = false;
  isloding: boolean = false;
  UsreName: string = '';

  singIn(form: any) {
    console.log(form);

    if (form.valid) {
      this.isloding = true;
      this._AuthonService.singnIn(form.value).subscribe({
        next: (resp) => {
          console.log(resp);

          this.isloding = false;
          this.isError = false;

          console.log('token from login response', resp.token);
          if (resp.token) {
            localStorage.setItem('token', resp.token);
            this._AuthonService.isLogin.next(true);
            this._AuthonService.UsreName.next(resp.user.name);
            this._ToastrService.success(
              this._Translate.instant('TOAST.LOGIN_SUCCESS'),
              '',
              { toastClass: 'custom-toast toast-success' }
            );

            this._router.navigate(['/home']);
          }
        },
        error: (err) => {
          console.log(err);
          this.isloding = false;
          this.isError = true;
          this.UsreName = '';
           this._ToastrService.error(this._Translate.instant('TOAST.LOGIN_FAILED'),
            '',
            {
              toastClass: 'custom-toast toast-error',
            });
        },
        complete: () => {},
      });
    } else {
      console.log('form invalid');
    }
  }

  navigateToForgotPassword() {
    this._router.navigate(['/forgot-password']);
  }
}
