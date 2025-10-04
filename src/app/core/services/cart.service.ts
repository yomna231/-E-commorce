import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OrderAdress } from '../../shared/interface/product';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  _HttpClient = inject(HttpClient);
  private _Router = inject(Router);
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  updateCartCount(count: number): void {
    this.cartCount.next(count);
  }

  AddproductToCard(pId: any): Observable<any> {
    return this._HttpClient
      .post('https://ecommerce.routemisr.com/api/v1/cart', { productId: pId })
      .pipe(
        tap((res: any) => {
          if (res && res.numOfCartItems !== undefined) {
            this.cartCount.next(res.numOfCartItems);
          } else {
            this.cartCount.next(this.cartCount.value + 1);
          }
        })
      );
  }

  getloggedUserCart(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/cart');
  }

  upDateItemQnty(myCount: any, id: any): Observable<any> {
    return this._HttpClient.put(
      `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      { count: myCount }
    );
  }

  DeleteSpecificProduct(id: any): Observable<any> {
    return this._HttpClient
      .delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`)
      .pipe(
        tap(() => {
          this.cartCount.next(Math.max(0, this.cartCount.value - 1));
        })
      );
  }

  DeleteUserCart(): Observable<any> {
    return this._HttpClient.delete(
      'https://ecommerce.routemisr.com/api/v1/cart'
    );
  }

  checkOutSession(cart_id: any, Adderess: OrderAdress): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart_id}?url=http://localhost:4200`,
      {
        shippingAddress: Adderess,
      }
    );
  }

  createCashOrder(cart_id: any, address: OrderAdress): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/${cart_id}`,
      {
        shippingAddress: address,
        paymentMethod: 'cash',
      }
    );
  }

  getOrderById(orderId: string): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/orders/${orderId}`
    );
  }

  getAllOrders(): Observable<any> {
    return this._HttpClient.get(
      'https://ecommerce.routemisr.com/api/v1/orders'
    );
  }
}
