import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [
    CommonModule,
    ItemCardComponent
  ],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent {

  activeCategoryId: number = 0;
  products: any[] = [];
  loggedInObj: any = {};
  isAddToCartApiCallInProgress: boolean = false;
  

  constructor(private productService: ProductService, private activateRoute: ActivatedRoute, private toastr: ToastrService) {
    this.activateRoute.params.subscribe((res: any) => {
      this.activeCategoryId = res.categoryId;
      this.loadCategoryProducts();
    })
  }

  loadCategoryProducts() {
    this.productService.getCategoryProducts(this.activeCategoryId).subscribe({
      next: (res: any) => {
        this.products = res.data;
      }
    });
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
        this.productService.addToCart(addToCartObj).subscribe((res: any) => {
          if (res.result) {
            product.isAddToCartApiCallInProgress = false;
            this.toastr.success("Product Added to cart");
            this.productService.cartUpdated$.next(true);
          } else {
            product.isAddToCartApiCallInProgress = false;
            this.toastr.error(res.message ? res.message : "Error adding product to cart");
          }
        },
          (err: any) => {
            product.isAddToCartApiCallInProgress = false;
            this.toastr.error(err.message ? err.message : "An error occurred while adding the product to the cart. Please try again later.");
          });
      }
    }
    else {
      this.toastr.warning("Please Login To Add Product");
    }
  }

  decrementQuantity(product: any) {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }
  getQuantity(product: any): number {
    return product.quantity || 1;
  }
  increment(product: any) {
    if (!product.quantity) {
      product.quantity = 1;
    } else {
      product.quantity++;
    }
  }
}
