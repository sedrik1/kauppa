import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ProductsService } from './products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
    console.log(localStorage.hasOwnProperty('cart'));
    console.log(localStorage.getItem('cart'));

/*     if (localStorage.hasOwnProperty('orderDone')) {
      localStorage.removeItem('orderDone');
    } */
  }
}
