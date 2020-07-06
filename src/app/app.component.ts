import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ProductsService } from './products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  localStorageCartProducts = 0;
  localStorageCartTotalPrice = 0;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    if (this.authService.checkForExcistingToken() === undefined) {
      this.authService.guestToken();
    }
    this.authService.getCurrentUserListener().subscribe();
    this.productsService.getProductsDB();
    if (localStorage.hasOwnProperty('cart')) {
      this.productsService.productsInCartArray = JSON.parse(localStorage.getItem('cart'));
      this.productsService.productsInCartArrayListener
      .next(JSON.parse(localStorage.getItem('cart')));
      for (const element of JSON.parse(localStorage.getItem('cart'))) {
        this.localStorageCartProducts += element.quantity;
        this.localStorageCartTotalPrice += element.price * element.quantity;
      }
      this.productsService.productsInCart = this.localStorageCartProducts;
      this.productsService.productsInCartTotalPrice = this.localStorageCartTotalPrice;
      this.productsService.productsInCartListener
      .next(this.localStorageCartProducts);
      this.productsService.productsInCartTotalPriceListener
      .next(this.localStorageCartTotalPrice);
    }
    if (localStorage.hasOwnProperty('cart')) {
      console.log(localStorage.getItem('cart'));
    }
    if (JSON.stringify(new Date()) > localStorage.getItem('timer')) {
      localStorage.removeItem('timer');
      localStorage.removeItem('orderProducts');
      localStorage.removeItem('orderDone');
    }
  }
}
