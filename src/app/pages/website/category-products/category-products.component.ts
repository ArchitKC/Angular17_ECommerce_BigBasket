import { categoryObject } from './../../../services/constant/interfaces';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { ProductService } from '../../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

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
  

  constructor(private productService: ProductService, private activateRoute: ActivatedRoute) {
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
    throw new Error('Method not implemented.');
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
