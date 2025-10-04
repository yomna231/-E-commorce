import { Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/producs/product.service';
import { Category } from '../../../shared/interface/product';
import { TranslatePipe } from '@ngx-translate/core';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';

@Component({
  selector: 'app-categories',
  imports: [TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
   

  _productService = inject(ProductService);
   _myTranslation = inject(MytranslationService);
  allCategory: Category[] = [];


 
ngOnInit(){

  this._productService.getAllCategories().subscribe({
    next:(res)=>{
      console.log('Categories fetched successfully');
      this.allCategory=res.data;

    }
    ,error:(error)=>{
      console.log('Error fetching categories',error);
    }
  })


} 


}
