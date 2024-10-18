import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  isNewProduct: boolean = false;

  productObj: any = {
    "productId": 0,
    "productSku": "",
    "productName": "",
    "productPrice": 0,
    "productShortName": "",
    "productDescription": "",
    "createdDate": new Date(),
    "deliveryTimeSpan": "",
    "categoryId": 0,
    "productImageUrl": "",
  }

  categoryList: any[] = [];
  productList: any[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe((res: any) => {
      this.categoryList = res.data;
    })
  }

  getAllProducts() { 
    this.productService.getAllProducts().subscribe((res: any) => {
      this.productList = res.data;
    })
  }

  openSidePanel() {
    this.isNewProduct = true;
  }

  closeSidePanel() {
    this.isNewProduct = false;
  }

  onSaveProduct() { 
    this.productService.saveProduct(this.productObj).subscribe((res: any) => {
      if(res.result){
        alert("Product saved successfully");
        this.closeSidePanel();
      }else{
        alert("Failed to save product");
      }
    })
  }

  onUpdateProduct(productObj: any) {
    this.productService.updateProduct(productObj).subscribe((res: any) => {
      if(res.result){
        alert("Product updated successfully");
        this.closeSidePanel();
      }else{
        alert("Failed to update product");
      }
    })
  }

  onDeleteProductItem(item:any) {
    this.productService.deleteProduct(item.productId).subscribe((res: any)=>{
      if(res.result){
        alert("Product deleted successfully");
        this.getAllProducts();
      }else{
        alert("Failed to delete product");
      }
    })
  }

  onEditProductItem(item:any) {
    this.productObj = item;
    this.openSidePanel();
  }
}
