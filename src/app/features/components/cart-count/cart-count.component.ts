import { AuthonService } from './../../../core/services/authontication/authon.service';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-count',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-count.component.html',
  styleUrl: './cart-count.component.scss',
})
export class CartCountComponent implements OnInit {
  private _cartService = inject(CartService);
  private _authService = inject(AuthonService);
  cartCount: number = 0;
  isLoading: boolean = false;

  ngOnInit() {
    this._authService.isLogin.subscribe((loggedIn) => {
      this.isLoading = loggedIn;
      if (loggedIn) {
        this.loadInitialCount();
      } else {
        this.cartCount = 0;
      }
    });

    this._cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
    // this.loadInitialCount();
  }
  private loadInitialCount() {
    this._cartService.getloggedUserCart().subscribe({
      next: (res) => {
        if (res) {
          this._cartService.updateCartCount(res.numOfCartItems || 0);
        }
      },
      error: () => {
        this._cartService.updateCartCount(0);
      },
    });
  }
}
