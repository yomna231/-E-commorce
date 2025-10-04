import { Product } from './../../../shared/interface/product';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { MytranslationService } from '../translate/mytranslation.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  

  private _httpClient = inject(HttpClient);
  _mytranslate = inject(MytranslationService);
  private _toastr = inject(ToastrService);
  private readonly WISHLIST_KEY = 'user_wishlist';



  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  wishlist = this.wishlistSubject.asObservable();

  private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';

  initializeWishlist(): Observable<{ count: number; data: Product[] }> {
    return this._httpClient.get<{ data: Product[] }>(this.baseUrl).pipe(
      map((res) => ({
        count: res.data?.length ?? 0,
        data: res.data ?? [],
      })),
      tap((data) => {
        this.wishlistSubject.next(data.data);
        this.saveWishlist(data.data);
      }),
      catchError((err) => {
        console.error('Error loading wishlist:', err);
        const local = this.getSavedWishlist();
        this.wishlistSubject.next(local);
        return of({
          count: local.length,
          data: local,
        });
      })
    );
  }



  loadInitialWishlist() {
    this._httpClient
      .get<{ data: Product[] }>(
        'https://ecommerce.routemisr.com/api/v1/wishlist'
      )
      .subscribe({
        next: (res) => {
          this.wishlistSubject.next(res.data || []);
        },
        error: (error) => {
          console.error('Error loading wishlist from server', error);

          this.wishlistSubject.next([]);
        },
      });
  }

  addToWishList(product: Product): Observable<any> {
    if (this.isInWishList(product._id)) {
      return of(null);
    }

    return this._httpClient
      .post('https://ecommerce.routemisr.com/api/v1/wishlist', {
        productId: product._id,
      })
      .pipe(
        tap({
          next: () => {
            const updatedWishlist = [...this.wishlistSubject.value, product];
            this.wishlistSubject.next(updatedWishlist);
            this.saveWishlist(updatedWishlist);

            /////// tosrer

            const msg = this._mytranslate.instant(
              'TOAST.ADD_TO_WISHLIST_SUCCESS'
            );
            this._toastr.success(msg, '', {
              toastClass: 'custom-toast toast-success',
            });
          },
        })
      );
  }

  removeFromWishList(productId: string): Observable<any> {
    return this._httpClient
      .delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`)
      .pipe(
        tap(() => {
          const updatedWishlist = this.wishlistSubject.value.filter(
            (item) => item._id !== productId
          );
          this.wishlistSubject.next(updatedWishlist);
          this.saveWishlist(updatedWishlist);

          //////////
          const msg = this._mytranslate.instant(
            'TOAST.REMOVE_WISHLIST_SUCCESS'
          );
          this._toastr.success(msg, '', {
            toastClass: 'custom-toast toast-error',
          });
        })
      );
  }

  toggleWishList(product: Product): Observable<boolean> {
    const exists = this.isInWishList(product._id);

    const operation = exists
      ? this.removeFromWishList(product._id).pipe(map(() => false))
      : this.addToWishList(product).pipe(map(() => true));

    return operation.pipe(
      catchError((err) => {
        console.error('Error toggling wishlist:', err);
        return of(exists);
      })
    );
  }

  isInWishList(productId: string): boolean {
    return this.wishlistSubject.value.some((item) => item._id === productId);
  }



  saveWishlist(wishlist: Product[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
      }
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getSavedWishlist(): Product[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.WISHLIST_KEY);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return [];
    }
  }
}
