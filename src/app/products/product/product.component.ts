import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../product.model';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private productId: string;
  product: Product;
  productsInCartArray: Product[];
  checkQuantity: number;
  checkQuantityReference: number;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.productId = paramMap.get('id');
      this.productsService.getProduct(this.productId).subscribe(product => {
        this.product = {
          _id: product._id,
          category: product.category,
          name: product.name,
          quantity: product.quantity,
          brand: product.brand,
          price: product.price,
          sizes: product.sizes,
          colours: product.colours
        };
        this.checkQuantity = product.quantity;
        this.checkQuantityReference = product.quantity;
      });
    });
    this.productsInCartArray = this.productsService.getProductsInCartArray();
    this.productsService.getProductsInCartArrayListener()
    .subscribe(items => {
      this.productsInCartArray = items;
    });
  }

  onAddToCart(form: NgForm, product: Product): void {
    this.checkQuantity = this.checkQuantity - 1;
    if (this.checkQuantity < 0) {
      return;
    }
    for (const element of this.productsInCartArray) {
      if (element._id === product._id && element.quantity === this.checkQuantityReference ) {
        return;
      }
    }
    if (form.invalid) {
      return;
    }
    const prod = {
      _id: product._id,
      category: product.category,
      name: product.name,
      brand: product.brand,
      quantity: 1,
      price: product.price,
      sizes: [form.value.size],
      colours: [form.value.colour],
      maxQuantity: product.quantity
    };
    this.productsService.addProductToCart(prod);
    this.snackBar.open('Tuote lisätty', 'Sulje', {
      duration: 2000,
    });
    form.resetForm();
  }

}
