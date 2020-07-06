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
