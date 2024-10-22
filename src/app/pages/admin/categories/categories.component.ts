import { Category, categoryObject } from './../../../services/constant/interfaces';
import { Component } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../../../services/product/product.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

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
  isApiCallInProgress: any;
  
  categoryObj: categoryObject = new categoryObject();

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  saveCategory() {
    console.log('saveCategory');
  }
  getAllCategories() {
    this.products$ = this.productService.getAllCategories().pipe(
      map((item: { data: Category[] }) => {
        return item.data
      })
    );
  }

  updateCategory() {
    console.log('updateCategory');
  }
  
  onDelete() { }

  onEdit(item: any) {
    this.categoryObj = item;
    this.isSidePanel = true;
  }

  reset() {
    this.categoryObj = new categoryObject();
    this.isSidePanel = false;
  }
}