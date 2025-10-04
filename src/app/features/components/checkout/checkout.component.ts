import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  _CartService = inject(CartService);
  _ActivatedRoute = inject(ActivatedRoute);
  _myTranslation = inject(MytranslationService);

  private _Router = inject(Router);

  AdressForm = new FormGroup({
    details: new FormControl(null, Validators.required),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
    ]),
    city: new FormControl(null, Validators.required),
  });

  OnlinePay(formAdd: any) {
    let id = this._ActivatedRoute.snapshot.params?.['cartId'];

    console.log(formAdd);
    if (formAdd.valid) {
      this._CartService.checkOutSession(id, formAdd.value).subscribe({
        next: (res) => {
          console.log(res);
          location.href = res.session.url;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  CashOnDelivery(formAdd: any) {
    let id = this._ActivatedRoute.snapshot.params?.['cartId'];

    console.log(formAdd);
    if (formAdd.valid) {
      this._CartService.createCashOrder(id, formAdd.value).subscribe({
        next: (res) => {
          console.log('Order created successfully:', res);

          this._Router.navigate(['/order-confirmation', res.data._id]);
        },
      });
    }
  }
}
