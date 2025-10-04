import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/producs/product.service';
import { Product } from '../../../shared/interface/product';
import { ProductListComponent } from '../../../shared/components/products-list/product-list/product-list.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../core/services/cart.service';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, ProductListComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  Searchvalue: string = '';
  allProducts: Product[] = [];
  isLoading: boolean = false;

  _ProductService = inject(ProductService);
  private _cartService = inject(CartService);
  private _wishlistService = inject(WishlistService);
  private _toastr = inject(ToastrService);
  private _myTranslation = inject(MytranslationService);
  _Route = inject(Router);

  ngOnInit(): void {
    this.isLoading = true;
    this._ProductService.getAllProduct().subscribe({
      next: (res) => {
        console.log(res.data);
        this.allProducts = res.data;
        this.isLoading = false;

        this._wishlistService.wishlist.subscribe((wishlist) => {
          this.allProducts = this.allProducts.map((p) => ({
            ...p,
            isInWishlist: wishlist.some((w) => w._id === p._id),
          }));
        });
      },

      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  addToCard(id: string) {
    this._cartService.AddproductToCard(id).subscribe({
      next: () => {
        const msg = this._myTranslation.instant('TOAST.ADD_TO_CART_SUCCESS');
        this._toastr.success(msg, '', {
          toastClass: 'custom-toast toast-success',
        });
      },
      error: () => {
        const msg = this._myTranslation.instant('TOAST.ADD_TO_CART_ERROR');
        this._toastr.error(msg, '', {
          toastClass: 'custom-toast toast-error',
        });
      },
    });
  }

  toggle(product: Product) {
    this._wishlistService.toggleWishList(product).subscribe((isInWishlist) => {
      this.allProducts = this.allProducts.map((p) =>
        p._id === product._id ? { ...p, isInWishlist } : p
      );
    });
  }
}
