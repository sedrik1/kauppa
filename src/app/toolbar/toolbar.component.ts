import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.model';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  displayCartInner = true;
  isAuth = false;
  opened: boolean;
  isLoading = false;
  switchToolbar: boolean;
  currentUser: string;
  currentUserId: string;
  currentUserAuthLevel: string;
  currentUserOrders: any;
  productsInCart = 0;
  productsInCartArray: Product[];
  authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    public breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.isAuth = this.authService.getIsAuth();
    this.currentUser = this.authService.getUserEmail();
    this.productsInCart = this.productsService.getProductsInCart();
    this.productsInCartArray = this.productsService.getProductsInCartArray();
    this.productsService.getProductsInCartArrayListener().subscribe(
      products => {
        this.productsInCartArray = products;
        localStorage.setItem('cart', JSON.stringify(this.productsInCartArray));
      }
    );
    this.productsService.getProductsInCartListener().subscribe(
      products => {
        this.productsInCart = products;
      }
    );
    this.authStatusSub = this.authService.getIsAuthListener().subscribe((isAuhtorised) => {
      if (isAuhtorised) {
        this.isAuth = true;
        this.authService.getCurrentUserListener().subscribe(
          (user) => {
            this.currentUser = user;
          }
        );
        this.authService.getCurrentUserIdListener().subscribe(
          (id) => {
            this.currentUserId = id;
          }
        );
        this.authService.getCurrentUserAuthLevelListener().subscribe(
          (authLevel) => {
            this.currentUserAuthLevel = authLevel;
          }
        );
      } else {
        this.isAuth = false;
      }
    });
    this.breakpointObserver
    .observe(['(max-width: 559px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.switchToolbar = true;
      } else {
        this.switchToolbar = false;
      }
    });
  }

  onExpandCart(): void {
    this.displayCartInner = !this.displayCartInner;
  }

  onLogout(): void {
    this.authService.logout();
  }

  clearCart() {
    localStorage.removeItem('cart');
  }

  setCart() {
    localStorage.setItem('cart', 'testi');
  }

  checkCart() {
    console.log(localStorage.hasOwnProperty('cart'));
    console.log(localStorage.getItem('cart'));
  }

  checkProductsInCart() {
    console.log(this.productsInCartArray);
    console.log(this.productsInCart);
  }

  getIT() {
    let testi = this.productsInCartArray;
    let a = this.productsInCartArray;
    testi.toString();
    console.log('eka', testi);
    console.log('lel', testi.toString());
    JSON.stringify(a);
    console.log('toka', a);

    //JSON.parse(testi);
    if (this.authService.checkForExcistingToken === undefined) {
      this.authService.guestToken();
    } else {
      console.log(this.authService.getUserId());
      console.log(this.authService.getUserEmail());
    }
  }
  checkit() {
      this.authService.clearAuthData();
  }

}
