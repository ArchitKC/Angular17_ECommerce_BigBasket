import { Component } from '@angular/core';
import { placeOrderObject } from '../../../services/constant/interfaces';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  placeOrderObject: placeOrderObject = new placeOrderObject();
  cartItem: any[] = [];
  loginObject: any = {};
  isApiCallInProgress: boolean = false;

  constructor(private router: Router, private productService: ProductService, private toastr: ToastrService) {
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
      this.cartItem = res.data;
      if (!this.cartItem || this.cartItem.length === 0) {
        this.router.navigate(['/AllProducts']);
      }
    }, (err: any) => {
      this.toastr.error(err.message ? err.message : "An error occurred while retrieving cart items. Please try again later.");
    });

  }

  placeCartOrder(placeOrderForm: NgForm) {
    if (placeOrderForm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.placeOrderObject.CustId = this.loginObject.custId;
        this.placeOrderObject.TotalInvoiceAmount = this.calculateTotalSubTotal();
        this.placeOrderObject.SaleDate = new Date();
        this.productService.placeOrderInCart(this.placeOrderObject).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.toastr.success(res.message);
            this.placeOrderObject = new placeOrderObject();
            this.productService.cartUpdated$.next(true);
            placeOrderForm.resetForm();
            this.router.navigateByUrl('AllProducts');
          } else {
            this.isApiCallInProgress = false;
            this.toastr.error(res.message);
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
          this.toastr.error(err.message);
        });
      } else {
        Object.values(placeOrderForm.controls).forEach((control: any) => {
          control.markAsTouched();
        });
      }
    }
  }

  calculateTotalSubTotal() {
    let totalSubtotal = 0;
    for (const item of this.cartItem) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  deleteProductFromCartById(cartUd: number) {
    this.productService.removeProductByCartId(cartUd).subscribe((res: any) => {
      if (res.result) {
        this.productService.cartUpdated$.next(true);
        this.toastr.success("Product removed from cart successfully");
        this.getCartByCustomerId(this.loginObject.CustomerId);
      }
    }, (err: any) => {
      this.toastr.error(err.message ? err.message : "An error occurred while removing product from cart. Please try again later.");
    });
  }


}
