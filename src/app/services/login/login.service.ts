import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConstantUrls } from '../constant/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private confirmationService: ConfirmationService, private toastr: ToastrService) { }

  login(loginObj:any){
    return this.httpClient.post(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.LOGIN, loginObj);
  }

  logOut(loggedInObj: any) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want log out?',
    //   accept: () => {
        loggedInObj = {};
        sessionStorage.removeItem('bigBasket_user');
        sessionStorage.removeItem('token');
        this.toastr.success('You have been logged out', 'Thank you');
    //   }
    // });
  }

  registerCustomer(registerObj:any){
    return this.httpClient.post(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.REGISTER, registerObj);
  }

  useTokenLogin(tokenObj:any){
    return this.httpClient.post(ConstantUrls.API_END_POINT_USER + ConstantUrls.METHODS.USER_TOKEN_LOGIN, tokenObj);
  }

  updateProfile(obj: any): Observable<any> {
    return this.httpClient.put<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.UPDATE_PROFILE, obj);
  }

  getCustomerById(id: string):Observable<any> {
    return this.httpClient.get<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.GET_CUSTOMER_BY_ID + id);
  }
}
