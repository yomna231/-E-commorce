import { Product } from './../../../shared/interface/product';
import { Component, inject } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthonService } from '../../../core/services/authontication/authon.service';
import { count } from 'console';

@Component({
  selector: 'app-wish-list',
  imports: [TranslatePipe, FormsModule, CommonModule,RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss',
})
export class WishListComponent {
  private _WishlistService = inject(WishlistService);
  private _ToastrService = inject(ToastrService);
  private _cartService = inject(CartService);
    private _AuthonService = inject(AuthonService);
  _myTranslation = inject(MytranslationService);

  wishlist: Product[] = [];
  wislistLength:any;
  isLoading = false;


  ngOnInit() {
  this._WishlistService.wishlist.subscribe((data) => {
    this.wishlist = data;
  });

  this._AuthonService.isLogin.subscribe((loggedIn) => {
    if (loggedIn) {
      this.loadWishlist();
    } else {
      this.wishlist = [];
    }
  });
}


  loadWishlist() {
    this.isLoading = true;
    this._WishlistService.initializeWishlist().subscribe({
      next: (res) => {
        console.log(res);
        
        this.wishlist = res.data;
        this.wislistLength=res;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  remove(productId: string) {
    this._WishlistService.removeFromWishList(productId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter((p) => p._id !== productId);

        this.wislistLength={
          count : this.wishlist.length,
          data : this.wishlist
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isInWishlist(id: string): boolean {
    return this._WishlistService.isInWishList(id);
  }

  updateHeartStatus(productId: string, isInWishlist: boolean) {
    const products = this.wishlist.map((p: Product) => {
      if (p._id === productId) {
        return { ...p, isInWishlist };
      }
      return p;
    });
    this.wishlist = products;
  }

  addtoCart(productId: string) {
    this._cartService.AddproductToCard(productId).subscribe({
      next: () => {
        const msg = this._myTranslation.instant('TOAST.ADD_TO_CART_SUCCESS');
        this._ToastrService.success(msg, '', {
          toastClass: 'custom-toast toast-success',
        });
      },
      error: (error) => {
        console.log(error);
        const msg = this._myTranslation.instant('TOAST.ADD_TO_CART_ERROR');
        this._ToastrService.error(msg, '', {
          toastClass: 'custom-toast toast-error',
        });
      },
    });
  }
}
