import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  productsInCart = 0;
  productsInCartArray: Product[];
  products: Product[];
  productsTops: Product[];
  productsBottoms: Product[];
  productsApparel: Product[];
  showSearchResults = false;
  opened: boolean;
  showTops = true;
  showBottoms: boolean;
  showApparel: boolean;
  showAll: boolean;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.products = this.productsService.getProducts();
    this.productsTops = this.productsService.getProductsTops();
    this.productsBottoms = this.productsService.getProductsBottoms();
    this.productsApparel = this.productsService.getProductsApparel();
    this.productsInCartArray = this.productsService.getProductsInCartArray();
    this.productsService.getProductsListener().subscribe(
      products => {
        this.products = products;
      }
    );
    this.productsService.getProductsTopsListener().subscribe(
      products => {
        this.productsTops = products;
      }
    );
    this.productsService.getProductsBottomsListener().subscribe(
      products => {
        this.productsBottoms = products;
      }
    );
    this.productsService.getProductsApparelListener().subscribe(
      products => {
        this.productsApparel = products;
      }
    );
    this.productsService.getProductsInCartArrayListener().subscribe(
      products => {
        this.productsInCartArray = products;
        localStorage.setItem('cart', JSON.stringify(this.productsInCartArray));
      }
    );

  }

  onAddToCart(form: NgForm, product: Product): void {
    if (form.invalid) {
      return;
    }
    const prod: Product = {
      _id: product._id,
      category: product.category,
      name: product.name,
      brand: product.brand,
      quantity: 1,
      price: product.price,
      sizes: [form.value.size],
      colours: [form.value.colour]
    };
    this.productsService.addProductToCart(prod);
    this.productsInCart = this.productsService.getProductsInCart();
    form.resetForm();
  }

  onSearchForProducts(form: NgForm) {
    if (form.value.products.length > 0) {
      this.router.navigate([`/getProducts/${form.value.products}`]);
    }
  }

  onFilterProducts(filter: string) {
    if (filter === 'tops') {
      this.showTops = true;
      this.showBottoms = false;
      this.showApparel = false;
      this.showAll = false;
    } else if (filter === 'bottoms') {
      this.showBottoms = true;
      this.showApparel = false;
      this.showAll = false;
      this.showTops = false;
    } else if (filter === 'apparel') {
      this.showApparel = true;
      this.showBottoms = false;
      this.showAll = false;
      this.showTops = false;
    } else {
      this.showAll = true;
      this.showBottoms = false;
      this.showApparel = false;
      this.showTops = false;
    }
  }
}
