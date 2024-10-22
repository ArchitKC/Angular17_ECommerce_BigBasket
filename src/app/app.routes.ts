import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { LandingComponent } from './pages/website/landing/landing.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { CategoryProductsComponent } from './pages/website/category-products/category-products.component';
import { CartComponent } from './pages/admin/cart/cart.component';
import { CheckoutComponent } from './pages/website/checkout/checkout.component';
import { CustomerOrdersComponent } from './pages/website/customer-orders/customer-orders.component';
import { ErrorComponent } from './pages/website/error/error.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'AllProducts',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LandingComponent,
        children: [
            {
                path: 'AllProducts',
                component: WebProductsComponent
            },
            // {
            //     path: 'category/:categoryId',
            //     component: CategoryProductsComponent
            // },
            {
                path: 'cart',
                component: CartComponent
            }
        ]
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        //   canActivate: [authGuard],
        title: 'Checkout'
    },
    {
        path: 'order-history',
        component: CustomerOrdersComponent,
        //   canActivate: [authGuard],
        title: 'Your Orders'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'category',
                component: CategoriesComponent
            }
        ]
    }, 
    { 
        path: '**', 
        pathMatch: 'full',  
        component: ErrorComponent 
    }, 
];