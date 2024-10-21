import { Category } from '../constant/interfaces';
import { ConstantUrls } from './../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient, ) { }

  getAllProducts():Observable<any[]> {
    return this.httpClient.get<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.GET_ALL_PRODUCT);
  }

  getAllCategories():Observable<{ data: Category[] }> {
    return this.httpClient.get<{ data: Category[] }>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.GET_ALL_CATEGORY);
  }

  saveProduct(obj: any):Observable<any>{
    return this.httpClient.post<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.CREATE_PRODUCT, obj);
  }
  updateProduct(obj: any):Observable<any>{
    return this.httpClient.post<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.UPDATE_PRODUCT, obj);
  }

  deleteProduct(id: number):Observable<any>{
    return this.httpClient.get<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.DELETE_PRODUCT + id);
  }
}
