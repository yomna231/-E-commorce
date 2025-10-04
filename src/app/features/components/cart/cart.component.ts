import { cartData } from './../../../shared/interface/product';
import { CartService } from './../../../core/services/cart.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, TranslatePipe, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  _CartService = inject(CartService);
  _ToastrService = inject(ToastrService);
  _myTranslation = inject(MytranslationService);
  cartData: any;
  products: cartData[] = [];
  isLoading: boolean = false;
  productDetails: any;
  _WishlistService: any;

  ngOnInit(): void {
    this.isLoading = true;
    this._CartService.getloggedUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.cartData = res;
        this.products = res.data.products;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadCart(): void {
    this.isLoading = true;
    this._CartService.getloggedUserCart().subscribe({
      next: (res) => {
        this.cartData = res;
        this.isLoading = false;
      },
      error: (err) => {
         const msg = this._myTranslation.instant('TOAST.LOGIN_REQUIRED');
        this._ToastrService.success(msg, '', {
          toastClass: 'custom-toast toast-error',
        });
        this.isLoading = false;
      },
    });
  }

  updateQnty(Count: any, id: any) {
    this._CartService.upDateItemQnty(Count, id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartData = res;
        this.products = res.data.products;

        const msg = this._myTranslation.instant('TOAST.UPDATE_SUCCESS');
        this._ToastrService.success(msg, '', {
          toastClass: 'custom-toast toast-success',
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  removeItem(id: any) {
    this._CartService.DeleteSpecificProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartData = res;
        this.products = res.data.products;
         const msg = this._myTranslation.instant('TOAST.REMOVE_SUCCESS');
        this._ToastrService.success(msg, '', {
          toastClass: 'custom-toast toast-error',
        });

      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  removeUserOfCart() {
    this._CartService.DeleteUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartData = { numOfCartItems: 0, data: { products: [] } };
        this.products = [];
        this._CartService.updateCartCount(0);

        const msg = this._myTranslation.instant('TOAST.CLEAR_SUCCESS');
        this._ToastrService.success(msg, '', {
          toastClass: 'custom-toast toast-success',
        });
      },
      error: (error) => {
        console.log('error cleaning cart', error);
      },
    });
  }
}
