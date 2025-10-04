import { CommonModule } from '@angular/common';
import { CartService } from './../../../core/services/cart.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  _myTranslation = inject(MytranslationService);
  order: any;
  loading: boolean = false;

  ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    this.loadOrderDetails(orderId);
  }

  loadOrderDetails(orderId: string): void {
    this.cartService.getOrderById(orderId).subscribe({
      next: (res) => {
        this.loading = true;
        this.order = res.data;

        if (this.order?.cartItems) {
          this.order.cartItems.forEach((item: any) => (item.expanded = false));
        }
      },
    });
  }

  calculateSubtotal(): number {
    if (!this.order?.cartItems) return 0;
    return this.order.cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.count,
      0
    );
  }

  navigateToOrders(): void {
    this.router.navigate(['/home']);
  }

  printOrder(): void {
    window.print();
  }

  getFirstWords(text: string, wordsCount: number = 3): string {
    if (!text) return '';
    const words = text.split(' ');
    return words.slice(0, wordsCount).join(' ');
  }

  toggleExpand(item: any): void {
    item.expanded = !item.expanded;
  }
}
