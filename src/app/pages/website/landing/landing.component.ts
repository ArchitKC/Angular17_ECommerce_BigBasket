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

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.getAllCategories();
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
}

  