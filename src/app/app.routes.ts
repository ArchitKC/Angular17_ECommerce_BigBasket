import { Routes } from '@angular/router'; 
import { LoginComponent } from './pages/admin/login/login.component';
import { LandingComponent } from './pages/website/landing/landing.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { WebProductsComponent } from './pages/website/web-products/web-products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';

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
        path: 'AllProducts',
        component: LandingComponent,
        children: [
            {path: 'AllProducts', component: WebProductsComponent},
        ]
    },
    { 
        path: '', 
        component: LayoutComponent, 
        children: [
            {path: 'products', component: ProductsComponent},
            {path: 'category', component: CategoriesComponent}
        ]}, 
];