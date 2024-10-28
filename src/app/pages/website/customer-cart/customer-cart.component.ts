import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './customer-cart.component.html',
  styleUrl: './customer-cart.component.css'
})
export class CustomerCartComponent {

  loginObject: any = {};
  cartList: any[] = [];
  showCheckOut: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params =>{
      this.showCheckOut = params['showCheckOut'];
    });
  }

  constructor(private productService: ProductService, private activatedRoute:ActivatedRoute) {
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loginObject = JSON.parse(localData);
      this.getCartByCustomerId(this.loginObject.custId);
    }
    this.productService.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loginObject.custId);
      }
    });
  }

  getCartByCustomerId(custId: number) {
    this.productService.getCartItemByCustomerId(custId).subscribe((res: any) => {
      if (res.result)
        this.cartList = res.data;
    });
  }

  calculateTotalSubTotal() {
    let totalSubtotal = 0;
    for (const item of this.cartList) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }


  increaseQuantity(cartListItem: any) {
    if (!cartListItem.quantity) {
      cartListItem.quantity = 1;
    } else {
      cartListItem
      cartListItem.quantity++;
    }
  }

  decreaseQuantity(cartListItem: any) {
    if (cartListItem.quantity && cartListItem.quantity > 1) {
      cartListItem.quantity--;
    }
  }
}
