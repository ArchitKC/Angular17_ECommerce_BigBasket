import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Category, productObject } from '../../../services/constant/interfaces';
import { ProductService } from '../../../services/product/product.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TruncatePipe,
    PaginatorModule,
    EditorModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  @ViewChild('productFrm') productFrm!: NgForm;
  isSidePanelVisible: boolean = false;
  displayModalProduct: boolean = false;
  first: number = 0;
  rows: number = 8;
  filteredProductsList: any[] = [];
  isApiCallInProgress: boolean = false;

  productObj: productObject = new productObject();

  categoryList: Category[] = [];
  productList: any[] = [];

  constructor(private productService: ProductService, private toastr: ToastrService) {
    this.productService.searchBox.subscribe((res: string) => {
      this.filteredProductsList = this.productList.filter((product: any) => {
        return Object.values(product).some((val: any) => {
          return val.toString().toLowerCase().includes(res.toLowerCase());
        });
      });
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe((res: { data: Category[] }) => {
      this.categoryList = res.data;
    })
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.productList = res.data;
      this.filteredProductsList = res.data;
    })
  }

  closeProductModal() {
    this.displayModalProduct = false;
    this.onReset();
  }

  onReset() {
    this.displayModalProduct = false;
    this.productFrm.resetForm();
    this.getAllProducts();
  }

  openProductModal() {
    this.displayModalProduct = true;
  }


  onSaveProduct() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productService.saveProduct(this.productObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success("Product Created Successfully");
          this.getAllProducts();
          this.closeProductModal();
        } else {
          this.toastr.error("Failed to create product");
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toastr.error(err.message);
      })
    }
  }

  onUpdateProduct() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productService.updateProduct(this.productObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          this.toastr.success("Product updated Successfully");
          this.getAllProducts();
          this.closeProductModal();
        } else {
          this.toastr.error("Failed to update product");
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        this.toastr.error(err.message);
      })
    }
  }

  onDeleteProductItem(item: any) {
    const isDelete = confirm("Are you sure you want to delete this product?");
    if (isDelete) {
      this.productService.deleteProduct(item.productId).subscribe((res: any) => {
        if (res.result) {
          this.toastr.success("Product deleted Successfully");  // show success message
          this.getAllProducts();
        } else {
          this.toastr.error("Failed to delete product");  // show error message
        }
      })
    }
  }

  onEditProductItem(item: any) {
    this.productObj = item;
    this.openProductModal();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // Ensure that the first index is within bounds of the filtered list
    if (this.first >= this.filteredProductsList.length) {
      this.first = Math.max(0, this.filteredProductsList.length - this.rows);
    }
  }

  ngOnChanges(): void { 
    if (this.first >= this.filteredProductsList.length) {
      this.first = 0;
    }
  }
}