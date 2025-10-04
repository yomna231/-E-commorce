import { Routes } from '@angular/router';
import { HomeComponent } from './features/components/home/home.component';
import { CartComponent } from './features/components/cart/cart.component';
import { BrandsComponent } from './features/components/brands/brands.component';
import { CategoriesComponent } from './features/components/categories/categories.component';
import { LoginComponent } from './features/components/login/login.component';
import { ProductsComponent } from './features/components/products/products.component';
import { RegisterComponent } from './features/components/register/register.component';
import { NotfoundComponent } from './features/components/notfound/notfound.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { notLoginGuard } from './core/guards/auth/not-login.guard';
import { SingleProductComponent } from './features/components/single-product/single-product.component';
import { CheckoutComponent } from './features/components/checkout/checkout.component';
import { WishListComponent } from './features/components/wish-list/wish-list.component';
import { OrderConfirmationComponent } from './features/components/order-confirmation/order-confirmation.component';
import { ForgotPasswordComponent } from './features/components/forgot-password/forgot-password.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home', canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, title: 'cart', canActivate: [authGuard] },
  { path: 'brands', component: BrandsComponent, title: 'brands', canActivate: [authGuard] },
  { path: 'checkout/:cartId', component: CheckoutComponent, title: 'Check Out', canActivate: [authGuard] },
  { path: 'single/:pid/:pName', component: SingleProductComponent, title: 'Single Product', canActivate: [authGuard] },
  { path: 'categories', component: CategoriesComponent, title: 'categories', canActivate: [authGuard] },
  { path: 'wishlist', component: WishListComponent, title: 'WishList', canActivate: [authGuard] },
  { path: 'products', component: ProductsComponent, title: 'products', canActivate: [authGuard] },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent, title: 'Order Confirmation', canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, title: 'login', canActivate: [notLoginGuard] },
  { path: 'register', component: RegisterComponent, title: 'register', canActivate: [notLoginGuard] },
  {
    path: 'forgot-password',
    children: [
      { path: '', component: ForgotPasswordComponent },
      { path: 'verify-code', component: ForgotPasswordComponent, title: 'Verify Code' },
      { path: 'reset-password', component: ForgotPasswordComponent, title: 'Reset Password' }], canActivate: [notLoginGuard]
  },
  { path: '**', component: NotfoundComponent, title: '404 error' },

];
