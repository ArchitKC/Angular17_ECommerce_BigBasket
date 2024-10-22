import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../../../shared/components/item-card/item-card.component';
import { Category } from '../../../services/constant/interfaces';

@Component({
  selector: 'app-web-products',
  standalone: true,
  imports: [
    CommonModule,
    ItemCardComponent
  ],
  templateUrl: './web-products.component.html',
  styleUrl: './web-products.component.css'
})
export class WebProductsComponent {
  productList: any[] = [];
  productsToShow: any[] = [];
  currentIndex = 0;
  categoryList: Category[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
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
        console.log('Error Fetching categories', error);
      },
      complete: () => {
        console.log('Categories fetched successfully');
      }
    })
  }

  addToCart(product: any) {
    throw new Error('Method not implemented.');
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
    console.log('Navigating to products for category:', categoryId);
  }
}
