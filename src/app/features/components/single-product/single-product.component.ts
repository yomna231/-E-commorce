import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/producs/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/interface/product';
import { AuthonService } from '../../../core/services/authontication/authon.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';

@Component({
  imports: [FormsModule, CommonModule, TranslatePipe],
  standalone: true,
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.scss',
})
export class SingleProductComponent {
  private _ProductService = inject(ProductService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _WishlistService = inject(WishlistService);
  productDetails: Product | undefined;
  productImage!: Product[];
  _AuthonService = inject(AuthonService);
  _CartService = inject(CartService);
  _ToastrService = inject(ToastrService);
  _myTranslation = inject(MytranslationService);

  ngOnInit(): void {
    let productId = this._ActivatedRoute.snapshot.params?.['pid'];
    this._ProductService.getSpecificProduct(productId).subscribe({
      next: (resp) => {
        console.log(resp);
        this.productDetails = resp.data;
        this.productImage = resp.data.images;
      },
      error: () => {},
    });
  }

  addToCard(id: any) {
    if (this._AuthonService.isLogin.value) {
      this._CartService.AddproductToCard(id).subscribe({
        next: (res) => {
          console.log(res);
          const msg = this._myTranslation.instant('TOAST.ADD_TO_CART_SUCCESS'); 
          this._ToastrService.success(msg,'',{
            toastClass :'custom-toast toast-success' }
          );
        },
        error: (error) => {
          console.log(error);
           const errorMsg = this._myTranslation.instant('TOAST.ADD_TO_CART_ERROR');
              this._ToastrService.error(errorMsg, '', {
            toastClass: 'custom-toast toast-error',
          });
        },
      });
    }
  }

  isInWishlist = (id?: string): boolean => {
    return id ? this._WishlistService.isInWishList(id) : false;
  };

  toggleWishlist() {
    if (!this.productDetails) return;

    this._WishlistService.toggleWishList(this.productDetails).subscribe({
      next: (isInWishlist) => {
        console.log('تم تحديث المفضلة بنجاح', isInWishlist);
      },
    });
  }
}
