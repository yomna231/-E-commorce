import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../../interface/product';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../../../core/services/translate/mytranslation.service';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule,TranslatePipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})


export class ProductListComponent {
  @Input() products: Product[] = [];
  @Input() searchValue: string = '';
  @Output() addToCart = new EventEmitter<string>();
  @Output() toggleWishlist = new EventEmitter<Product>();


  _myTranslation = inject(MytranslationService);

}
