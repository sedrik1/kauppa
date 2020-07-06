import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfilePageComponent } from './auth/profile-page/profile-page.component';
import { AuthGuard } from './auth/auth.guard';
import { CartComponent } from './products/cart/cart.component';
import { ProductComponent } from './products/product/product.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { CompletedOrderComponent } from './products/completed-order/completed-order.component';
import { SearchedComponent } from './products/searched/searched.component';


const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'getProducts/:query', component: SearchedComponent },
  { path: 'completed', component: CompletedOrderComponent },
  { path: 'cart', component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
