import { Product } from './../../shared/interface/product';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(products: Product[], SearchWord: string): Product[] {
    return products.filter(product => product.title.toLowerCase().includes(SearchWord.toLowerCase()))
  }
}
