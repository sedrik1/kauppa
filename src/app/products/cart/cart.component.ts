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
  itemsInCartArray = [];

  constructor(
    private productsService: ProductsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cartTotal = this.productsService.getProductsInCartTotal();
    this.itemsInCartArray = this.productsService.getProductsInCartArray();
    this.productsService.getProductsInCartArrayListener().subscribe(
      items => {
        this.itemsInCartArray = items;
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
    this.productsService.placeAnOrder(this.itemsInCartArray, this.authService.getUserId());
  }
}
