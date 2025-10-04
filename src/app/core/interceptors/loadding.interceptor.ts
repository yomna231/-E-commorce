import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';



export const loaddingInterceptor: HttpInterceptorFn = (req, next) => {

  let spinner = inject(NgxSpinnerService)
  const isAddToCartRequest = req.method === 'POST' && req.url.includes('/api/v1/cart');

  if (
    !isAddToCartRequest && (
      req.url === 'https://ecommerce.routemisr.com/api/v1/products' ||
      req.url === 'https://ecommerce.routemisr.com/api/v1/categories' ||
      req.url === 'https://ecommerce.routemisr.com/api/v1/cart'||
      req.url === 'https://ecommerce.routemisr.com/api/v1/wishlist'||
      req.url === 'https://ecommerce.routemisr.com/api/v1/brands'  
    )



  ) 
  {
    spinner.show();
  }


  return next(req).pipe(
    finalize(() => {
      spinner.hide();
    })
  );
};
