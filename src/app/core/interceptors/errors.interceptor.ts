import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err)=>{
      console.log('hello from error interceptor' ,err);
      
      return throwError(()=>{
        return err;
      });
    })
  );
};
