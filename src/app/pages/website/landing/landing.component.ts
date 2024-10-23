import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Category } from '../../../services/constant/interfaces';
import { ProductService } from '../../../services/product/product.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FooterComponent } from '../footer/footer.component';
import { loginObject, registerObject, userLoginObject, userProfileObject } from '../../../services/constant/loginInterfaceClass';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    FooterComponent,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  @ViewChild('loginForm') loginForm!: NgForm;
  @ViewChild('registerForm') registerForm!: NgForm;

  categoriesList: Category[] = [];
  categoryTree: Category[] = [];
  cartList: any[] = [];
  loggedInObj: any = {};


  displayModalLogin: boolean = false;
  displayModalRegistration: boolean = false;
  displayModalProfile: boolean = false;
  rememberMe: boolean = false;
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  showProfilePassword: boolean = false;
  isApiCallInProgress: boolean = false;

  loginObj: loginObject = new loginObject()
  userLoginObj: userLoginObject = new userLoginObject();
  registerObj: registerObject = new registerObject();
  profileObj: userProfileObject = new userProfileObject();


  phonePattern: string = "^((\\+91-?)|0)?[0-9]{10}$";


  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    public loginService: LoginService) {
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      this.loggedInObj = JSON.parse(localData);
      this.getCartByCustomerId(this.loggedInObj.custId)
    }
    this.productService.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loggedInObj.custId)
      }
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.categoryTree = this.buildCategoryTree(this.categoriesList);
  }

  getAllCategories() {
    this.productService.getAllCategories().subscribe({
      next: (res: { data: Category[] }) => {
        this.categoriesList = res.data.filter((list: any) => list.parentCategoryId === 0);; // Accessing categories array from res.data
      },
      error: (error) => {
        this.toastr.error('Error Fetching categories', error); 
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

  navigateToCategoryProduct(categoryId: number) {
    this.router.navigate(['/categoryProducts', categoryId]);
  }

  resetSubcategories() {
    // Reset subcategories for all parent categories
    this.categoriesList.forEach((category: any) => {
      category.subcategories = undefined;
    });
  }


  loadSubcategories(parentCategory: any) {
    // Reset subcategories for all other parent categories
    this.categoriesList.forEach((category: any) => {
      if (category !== parentCategory) {
        category.subcategories = undefined;
      }
    });
    // Fetch subcategories for the given parentCategoryId
    if (!parentCategory.subcategories) {
      setTimeout(() => {
        this.productService.getAllCategories().subscribe((res: any) => {
          const subcategories = res.data.filter((list: any) => list.parentCategoryId === parentCategory.categoryId);
          // Update the corresponding parent category with subcategories
          parentCategory.subcategories = subcategories; 
        });
      }, 100);
    }
  }

  getCartByCustomerId(custId: number) {
    this.productService.getCartItemByCustomerId(custId).subscribe((res: any) => {
      if (res.result)
        this.cartList = res.data;
    });
  }

  removeCartItem(cartId: number) {
    this.productService.removeProductByCartId(cartId).subscribe((res: any) => {
      this.getCartByCustomerId(this.loggedInObj.custId);
      this.productService.cartUpdated$.next(true);
      this.toastr.info(res.message);
    });
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartList) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  openLoginModal() {
    this.displayModalLogin = true;
  }

  closeLoginModal() {
    this.displayModalLogin = false;
    if (!this.rememberMe) {
      this.loginForm.resetForm();
      this.rememberMe = false;
    } else {
      this.rememberMe = true;
    }
  }

  resetLoginModal() {
    this.loginObj = new loginObject();
  }

  resetRegisterModal() {
    this.registerObj = new registerObject();
  }

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.loginService.login(this.loginObj).subscribe((res: any) => {
          if (res.result) {
            this.loginService.useTokenLogin(this.userLoginObj).subscribe((secondRes: any) => {
              if (secondRes.result) {
                this.isApiCallInProgress = false;
                this.loggedInObj = res.data;
                sessionStorage.setItem('bigBasket_user', JSON.stringify(this.loggedInObj));
                sessionStorage.setItem('token', JSON.stringify(secondRes.data.token));
                this.getCartByCustomerId(this.loggedInObj.custId);
                this.toastr.success('Login Successful', 'Success');
                if (this.rememberMe === true) {
                  sessionStorage.setItem('rememberMeUser', JSON.stringify(this.loginObj));
                } else {
                  sessionStorage.removeItem('rememberMeUser');
                }
                this.closeLoginModal();
                this.getCartByCustomerId(this.loggedInObj.custId);
              } else {
                this.isApiCallInProgress = false;
                this.toastr.error(secondRes.message, 'Secoind Response Error');
              }
            });
          } else {
            this.toastr.error(res.message, 'First Response Error');
            this.isApiCallInProgress = false;
          }
        }, (error) => {
          this.toastr.error('Error occured while trying to login', 'Error');
          this.isApiCallInProgress = false;
        });
      }
      this.isApiCallInProgress=false;
    }else{
      Object.values(loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  openProfileModal() {
    this.displayModalProfile = true;
    this.getCustomerByCustomerId();
  }

  closeProfileModal() {
    this.displayModalProfile = false;
    this.showProfilePassword = false;
  }

  updateProfile(){
    if(!this.isApiCallInProgress){
      this.isApiCallInProgress = true;
      this.loginService.updateProfile(this.profileObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false; 
          this.closeProfileModal();
          this.getCustomerByCustomerId();
          this.toastr.success(res.message, 'Profile Updated Successfully');
        } else {
          this.isApiCallInProgress = false;
          this.toastr.error(res.message, 'Response Error');
        }
      }, (error) => {
        this.isApiCallInProgress = false;
        this.toastr.error('Error occured while trying to update profile', 'Error');
      });
    }
  }

  getCustomerByCustomerId() {
    this.loginService.getCustomerById(this.loggedInObj.custId).subscribe((res: any) => {
      if (res.result) {
        this.profileObj = res.data;
      }
    });
  }

  onProfileEyeClick(){
    this.showProfilePassword = !this.showProfilePassword;
  }

  onRegisterEyeClick() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  openRegisterModal() {
    this.displayModalRegistration = true;
  }

  closeRegisterModal() {
    this.displayModalRegistration = false;
    if(this.registerForm.valid || this.registerForm.dirty || this.registerForm.touched)
      this.registerForm.resetForm();
  }

  register(registerForm: NgForm) { 
    if(registerForm.valid){    
      if(!this.isApiCallInProgress){
        this.isApiCallInProgress = true;
        this.loginService.registerCustomer(this.registerObj).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.loggedInObj = res.data
            this.toastr.success('Registration Successful', 'Success');
            this.closeRegisterModal();
          } else {
            this.toastr.error(res.message, 'Response Error');
            this.isApiCallInProgress = false;
          }
        }, (error :any) => {
          this.toastr.error(error.message, 'Error');
          this.isApiCallInProgress = false;
        });
      }
    } else {
      Object.values(registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onEyeClick() {
    this.showLoginPassword = !this.showLoginPassword;
  }

}

