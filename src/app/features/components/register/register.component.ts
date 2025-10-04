import { CommonModule } from '@angular/common';
import { AuthonService } from './../../../core/services/authontication/authon.service';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TranslatePipe, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  isErrorMsg: boolean = false;
  isLoading: boolean = false;
  _AuthonService = inject(AuthonService);
  _ToastrService = inject(ToastrService);
  _Translate = inject(TranslateService);
  translationService = inject(MytranslationService);

  registerForm = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z].{6,15}$/),
      ]),
      rePassword: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Z].{6,15}$/),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
    },
    this.confirmPassword
  );

  confirmPassword(f: any) {
    if (f.get('password')?.value === f.get('rePassword')?.value) {
      return null;
    } else {
      return { didntMatch: true };
    }
  }

  singUp(form: any) {
    if (form.valid) {
      this.isLoading = true;
      this._AuthonService.singUp(form.value).subscribe({
        next: (resp) => {
          console.log(resp);
          this.isErrorMsg = false;
          this.isLoading = false;

          if (resp.token) {
            localStorage.setItem('token', resp.token);
            this._AuthonService.isLogin.next(true);
            this._AuthonService.UsreName.next(resp.user.name);
          }

          this._ToastrService.success(
            this._Translate.instant('TOAST.REGISTER_SUCCESS'),
            '',
            {
              toastClass: 'custom-toast toast-success',
            }
          );
        },
        error: (err) => {
          console.log(err.error);
          this.isErrorMsg = true;
          this.isLoading = false;
          this._ToastrService.error(
            this._Translate.instant('TOAST.REGISTER_FAILED'),
            '',
            {
              toastClass: 'custom-toast toast-error',
            }
          );
        },
        complete: () => {},
      });
    } else {
      console.log('form not valid');
    }
  }
}
