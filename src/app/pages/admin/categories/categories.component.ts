import { Category, categoryObject } from './../../../services/constant/interfaces';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  products$: Observable<any> | undefined;
  // products$: Observable<any[]> = of([]);
  isSidePanel: boolean = false;
  isApiCallInProgress: boolean = false;

  categoryObj: categoryObject = new categoryObject();

  constructor(private productService: ProductService, private toaster: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.products$ = this.productService.getAllCategories().pipe(
      map((item: { data: Category[] }) => {
        return item.data
      })
    );
  }

  save_update_Catergory(successMessage: string) {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productService.save_update_Catergory(this.categoryObj).subscribe({
        next: (res) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.toaster.success(successMessage);
            this.getAllCategories();
            this.reset();
          } else {
            this.isApiCallInProgress = false;
            this.toaster.error(res.message);
          }
        }, error: (err: HttpErrorResponse) => {
          this.isApiCallInProgress = false;
          this.toaster.error(err.message);
          this.reset();
        }
      })
    }
  }
  saveCategory() {
    this.save_update_Catergory('Category Created Successfully');
  }

  updateCategory() {
    this.save_update_Catergory('Category Updated Successfully');
  }

  onDelete(categoryItem:categoryObject) { 
    this.toaster.info(`Deletion of  ${categoryItem.categoryName} is not implemented yet. It is WIP.`);
  }

  onEdit(item: any) {
    this.categoryObj = item;
    this.isSidePanel = true;
  }

  reset() {
    this.categoryObj = new categoryObject();
    this.isSidePanel = false;
  }
}