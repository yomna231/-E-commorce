import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthonService } from '../../../core/services/authontication/authon.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule,RouterLink,TranslatePipe ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {


  forgotForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    resetCode: new FormControl(null, [Validators.required]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{6,15}$/)]),
  });

  currentStep: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';
  emailForReset: string = '';

  _AuthonService = inject(AuthonService);
  _ToastrService = inject(ToastrService)
  _router = inject(Router);
  _route: ActivatedRoute = inject(ActivatedRoute);
  _Translate = inject(TranslateService);



  ngOnInit() {
    this._route.url.subscribe(url => {
      if (url[0]?.path === 'reset-password') {
        this.currentStep = 3;
      }
      else if (url[0]?.path === 'verify-code') {
        this.currentStep = 2;
      }
      else {
        this.currentStep = 1;
      }
    })
  }


  sendResetCode() {
    if (this.forgotForm.get('email')?.invalid) return;

    localStorage.setItem('resetEmail', this.forgotForm.value.email!);

    this.emailForReset = this.forgotForm.value.email!;

    this.isLoading = true;
    // this.errorMessage = '';

    this._AuthonService.ForgetPassword(this.forgotForm.value.email!).subscribe({
      next: (res) => {
        console.log(res);

        this.isLoading = false;
        this.currentStep = 2;
        this._router.navigate(['/forgot-password', 'verify-code']);
        this._ToastrService.success(this._Translate.instant('TOAST.RESET_SENT'), '', {
          toastClass: 'custom-toast toast-success'
        });
      },

      error: () => {
        this.isLoading = false;
        this._ToastrService.error(this._Translate.instant('TOAST.RESET_FAILED'), '', {
          toastClass: 'custom-toast toast-error'
        });

      }
    }

    )


  }



  verifyResetCode() {
    if (this.forgotForm.get('resetCode')?.invalid) return;

    this.isLoading = true;

    this._AuthonService.VerifyResetCode(this.forgotForm.value.resetCode!).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 3;
        this._router.navigate(['/forgot-password', 'reset-password']);
      }
      , error: () => {
        this.isLoading = false;
        this._ToastrService.error(this._Translate.instant('TOAST.INVALID_CODE'), '', {
          toastClass: 'custom-toast toast-error'
        });
      }
    })
  }


  resetPassword() {

    if (this.forgotForm.get('newPassword')?.invalid) return;
    this.isLoading = true;


    const email = localStorage.getItem('resetEmail');
    const newPassword = this.forgotForm.value.newPassword;


    if (!email) {
      this.isLoading = false;
      this._ToastrService.error(this._Translate.instant('TOAST.EMAIL_NOT_FOUND'), '', {
        toastClass: 'custom-toast toast-error'
      });
      return;
    }
    this._AuthonService.ResetPassword(email!,
      newPassword!).subscribe({
        next: (res) => {
          localStorage.removeItem('resetEmail');
         
          this.isLoading = false;
          this._ToastrService.success(this._Translate.instant('TOAST.PASSWORD_RESET_SUCCESS'), '', {
            toastClass: 'custom-toast toast-success',
          })
          this._router.navigate(['/login']);
        },
        error: (err) => {
          // console.log('api error', err);
          this.isLoading = false;

          this._ToastrService.error(this._Translate.instant('TOAST.PASSWORD_RESET_FAILED'), '', {
            toastClass: 'custom-toast toast-error',
          });
        }
      })
  }

}
