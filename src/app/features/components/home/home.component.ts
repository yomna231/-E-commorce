import { map } from 'rxjs/operators';
import { CartService } from './../../../core/services/cart.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/producs/product.service';
import { Category, Product } from '../../../shared/interface/product';
import { SliderCategoriesComponent } from '../../../shared/components/slider-categories/slider-categories.component';
import { AuthonService } from '../../../core/services/authontication/authon.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../../shared/components/products-list/product-list/product-list.component';
import { SplideGridComponent } from '../splide-grid/splide-grid.component';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';
@Component({
  selector: 'app-home',
  imports: [
    SliderCategoriesComponent,
    FormsModule,
    CommonModule,
    ProductListComponent,
    SplideGridComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  _Route = inject(Router);
  private _ProductService = inject(ProductService);
  _CartService = inject(CartService);
  _AuthonService = inject(AuthonService);
  _ToastrService = inject(ToastrService);
  _myTranslation = inject(MytranslationService);
  allProducts: Product[] = [];
  allCategory: Category[] = [];
  Searchvalue: string = '';
  isLoading: boolean = false;

  _WishlistService = inject(WishlistService);

  ngOnInit(): void {
    this.isLoading = true;

    this._WishlistService.initializeWishlist().subscribe({
      next: () => {
        this._ProductService.getAllProduct().subscribe({
          next: (res) => {
            console.log(res.data);
            this.allProducts = res.data.map((p: Product) => ({
              ...p,
              isInWishlist: this._WishlistService.isInWishList(p._id),
            }));
            this.isLoading = false;
          },
          error: (error) => {
            console.log(error);
          },
        });

        this._ProductService.getAllCategories().subscribe({
          next: (resp) => {
            console.log(resp.data);
            this.allCategory = resp.data;
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
    });
  }

  addToCard(id: any) {
    if (this._AuthonService.isLogin.value) {
      this._CartService.AddproductToCard(id).subscribe({
        next: (res) => {
          console.log(res);
          // this._ToastrService.success('It has been successfully added 🛺', '', {
          //   toastClass: 'custom-toast toast-success',
          // });

          const msg = this._myTranslation.instant('TOAST.ADD_TO_CART_SUCCESS');
          this._ToastrService.error(msg, '', {
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

  toggle(p: Product) {
    this._WishlistService.toggleWishList(p).subscribe({
      next: (isInWishlist) => {
        const products = this.allProducts.find((item) => item._id === p._id);

        if (products) {
          products.isInWishlist = isInWishlist;
        }
      },
    });
  }

  isInWishlist(id: string): boolean {
    return this._WishlistService.isInWishList(id);
  }

  categories = [
    { id: 1, name: 'Wines', image: 'image/slider-image-1.jpeg' },
    { id: 2, name: 'Gin', image: 'image/slider-image-2.jpeg' },
    { id: 3, name: 'Whiskey', image: 'image/slider-image-3.jpeg' },
    { id: 4, name: 'Vodka', image: 'image/banner-4.jpeg' },
    { id: 5, name: 'Brandy', image: 'image/grocery-banner-2.jpeg' },
  ];
}
