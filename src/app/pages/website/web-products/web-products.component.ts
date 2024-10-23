import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { Category } from '../../../services/constant/interfaces';
import { Observable } from 'rxjs';
import { OfferCardComponent } from '../../../shared/components/offer-card/offer-card.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-web-products',
  standalone: true,
  imports: [
    CommonModule,
    ItemCardComponent,
    OfferCardComponent
  ],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {
  // @ViewChild('productContainer') productContainer!: ElementRef;
  productList: any[] = [];
  productsToShow: any[] = [];
  loggedInObj: any = {};
  currentIndex = 0;
  categoryList: Category[] = [];
  offers$: Observable<any[]> | undefined; 
  isAddToCartApiCallInProgress:boolean = false;

  constructor(private productService: ProductService, private router: Router, private toastr:ToastrService) { 
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
    }
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.offers$ = this.productService.getOffers();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.productList = res.data;
      this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 4);
    })
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe({
      next: (res: { data: Category[] }) => { 
        res.data.forEach(category => {
          if(category.parentCategoryId == 0) { 
            this.categoryList.push(category);
          }
        }); 
      },
      error: (error) => {
        this.toastr.error('Error Fetching categories', error);
      }
    })
  }

  addToCart(product: any) {  
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      const addToCartObj = {
        "cartId": 0,
        "custId": this.loggedInObj.custId,
        "productId": product.productId,
        "quantity": product.quantity || 1,
        "addedDate": new Date()
      };
      if (!product.isAddToCartApiCallInProgress) {
        product.isAddToCartApiCallInProgress = true;
        this.productService.addToCart(addToCartObj).subscribe((res:any) => {
          if(res.result){
            product.isAddToCartApiCallInProgress = false;
            this.toastr.success("Product added to cart successfully");
            this.productService.cartUpdated$.next(true);
          }else{
            product.isAddToCartApiCallInProgress = false;
            this.toastr.error(res.message ? res.message : "Error adding product to cart");
          }
        },(error:any)=>{
          product.isAddToCartApiCallInProgress = false;
          this.toastr.error(error.message ? error.message : "An error occurred while adding the product to the cart. Please try again later.");
        })
      }else {
        this.toastr.warning("Please Login To Add Product");
      }
    }
  }

  getQuantity(product: any): number {
    return product.quantity || 1;
  }

  decrementQuantity(product: any) {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }

  increment(product: any) {
    if (!product.quantity) {
      product.quantity = 1;
    } else {
      product.quantity++;
    }
  }


  isNextDisabled(): boolean {
    return this.currentIndex + 4 >= this.productList.length;
  }
  nextProduct() {
    this.currentIndex += 4;  // Increment index by 3
    this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 4);  
  }
  isPreviousDisabled() {
    return this.currentIndex <= 0;
  }
  previousProduct() {
    this.currentIndex -= 4;  // Increment index by 3
    this.productsToShow = this.productList.slice(this.currentIndex, this.currentIndex + 4);  
  }

  navigateToProducts(categoryId: number) {
    this.router.navigate(['/categoryProducts', categoryId]);
  }
}
