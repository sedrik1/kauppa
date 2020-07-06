import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartTotal = 0;
  productsInCartArray = [];

  constructor(
    private productsService: ProductsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cartTotal = this.productsService.getProductsInCartTotal();
    this.productsInCartArray = this.productsService.getProductsInCartArray();
    if (localStorage.hasOwnProperty('cart')) {
/*       this.productsInCartArray = JSON.parse(localStorage.getItem('cart'));
      for (const element of JSON.parse(localStorage.getItem('cart'))) {
        this.cartTotal += element.price * element.quantity;
      } */
    }
    this.productsService.getProductsInCartArrayListener().subscribe(
      items => {
        this.productsInCartArray = items;
      }
    );
    this.productsService.getProductsInCartTotalListener().subscribe(
      total => {
        this.cartTotal = total;
      }
    );
  }

  onChangeProductQuantity(event: any, item: Product): void {
    console.log(event.target.value);
    this.productsService.changeItemQuantityInCart(event.target.value, item);
  }

  onDeleteFromCart(item): void {
    this.productsService.deleteItemFromCart(item);
  }

  onPlaceAnOrder() {
    this.productsService.placeAnOrder(this.productsInCartArray, this.authService.getUserId());
  }
}
