import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const bigBasketToken = sessionStorage.getItem('token'); const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${bigBasketToken}`)
  });
  return next(authReq);
};
