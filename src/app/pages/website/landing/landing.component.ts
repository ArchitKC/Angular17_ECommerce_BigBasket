import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Category } from '../../../services/constant/interfaces';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  categoriesList: Category[] = [];
  categoryTree: Category[] = [];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.getAllCategories();
    this.categoryTree =this.buildCategoryTree(this.categoriesList);
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe({
      next: (res: { data: Category[] }) => {
        this.categoriesList = res.data; // Accessing categories array from res.data
      },
      error:(error)=>{
        console.log('Error Fetching categories', error);
      }
    });
  }

  buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();
    const tree: Category[] = [];

    // Loop through categories and populate the map and tree in one pass
    categories.forEach(category => {
        categoryMap.set(category.categoryId, category);
        
        if (category.parentCategoryId === 0) {
            // It's a root category
            tree.push(category);
        } else {
            // It's a child category, add it to the parent's children array
            const parent = categoryMap.get(category.parentCategoryId);
            parent?.children ? parent.children.push(category) : parent!.children = [category];
        }
    });
    return tree;
  }
  
}

  