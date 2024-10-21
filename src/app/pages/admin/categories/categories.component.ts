import { Component } from '@angular/core'; 
import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { Category } from '../../../services/constant/interfaces';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent { 

  products$: Observable<Category[]> = of([]);

  constructor(private productService: ProductService) {

  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() { 
    this.products$ = this.productService.getAllCategories().pipe(
      map((item: {data:Category[]}) => { 
        console.log('Categories', item.data);
        return item.data
      })
    );
  }
}
