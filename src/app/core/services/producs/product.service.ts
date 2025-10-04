import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _HttpClient = inject(HttpClient);
  constructor() { }

  getAllProduct(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/products');
  };
  getAllCategories(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/categories');
  };


  getSpecificProduct(id: any): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  };

  getAllBrands(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/brands');

  }
  getSpecificBrand(id:string): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);

  }
}
