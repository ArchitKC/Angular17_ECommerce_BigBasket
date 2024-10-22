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
      },
      complete:()=>{
        console.log('Categories fetched successfully');
      }
    });
  }

  buildCategoryTree(categories: Category[]): Category[] {
    debugger;
    const categoryMap = new Map<number, Category>();

    // Create a map of categoryId -> category
    categories.forEach(category => categoryMap.set(category.categoryId, category));

    // Initialize the tree
    const tree: Category[] = [];

    // Loop through categories and assign children to their respective parents
    categories.forEach(category => {
      if (category.parentCategoryId == 0) {
        // If no parent, it's a root category
        tree.push(category);
      } else {
        // If it has a parent, add it to the parent's children array
        const parent = categoryMap.get(category.parentCategoryId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(category);
        }
      }
    }); 
    return tree;
  }
  
}

  