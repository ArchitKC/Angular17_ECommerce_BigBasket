import { Category } from '../constant/interfaces';
import { ConstantUrls } from './../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  searchBox: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public cartUpdated$: Subject<boolean> = new Subject();
  
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

  save_update_Catergory(obj: any):Observable<any>{
    return this.httpClient.post<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.CREATE_NEW_CATEGORY, obj);
  }

  getOffers(): Observable<any[]> { 
    return this.httpClient.get<any[]>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.GET_ALL_OFFERS).pipe(map((res: any) => res.data));
  }

  getCategoryProducts(categoryId: number): Observable<any[]> { 
    return this.httpClient.get<any[]>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.GET_ALL_PRODUCT_BY_CATEGORY + categoryId);
  }

  addToCart(obj: any): Observable<any>{
    return this.httpClient.post<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.ADD_TO_CART, obj)
  }

  getCartItemByCustomerId(customerId: number): Observable<any[]>{
    return this.httpClient.get<any[]>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.GET_CART_BY_CUST + customerId);
  }

  removeProductByCartId(customerId:number): Observable<any>{
    return this.httpClient.get<any>(ConstantUrls.API_END_POINT + ConstantUrls.METHODS.REMOVE_CART + customerId);
  }
}
