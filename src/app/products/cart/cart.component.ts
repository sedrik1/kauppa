import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private authService: AuthService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cartTotal = this.productsService.getProductsInCartTotal();
    this.productsInCartArray = this.productsService.getProductsInCartArray();
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

  onDeleteFromCart(product): void {
    this.productsService.deleteItemFromCart(product);
    this.snackBar.open(`${product.name} poistettu ostoskorista`, 'Sulje', {
      duration: 2000,
    });
  }

  onPlaceAnOrder() {
    this.productsService.placeAnOrder(this.productsInCartArray, this.authService.getUserId());
  }
}
