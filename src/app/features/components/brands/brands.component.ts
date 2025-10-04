import { Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/producs/product.service';
import { MytranslationService } from '../../../core/services/translate/mytranslation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  imports: [TranslatePipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
   _ProductService = inject(ProductService);
    _myTranslation = inject(MytranslationService);
  allBrands: any[] = [];
  selectBrand: any = null;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this._ProductService.getAllBrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.allBrands = res.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }


  openModel(id: string) {
    this._ProductService.getSpecificBrand(id).subscribe({
      next:(res)=>{
        this.selectBrand= res.data;
      }
    })
  }


  closeModel() {
    this.selectBrand = null;
  }


}
