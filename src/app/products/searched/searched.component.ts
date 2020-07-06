import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-searched',
  templateUrl: './searched.component.html',
  styleUrls: ['./searched.component.css']
})
export class SearchedComponent implements OnInit {

  productsSearched = [];
  query: string;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.query = paramMap.get('query');
      this.productsService.searchForProducts(this.query)
      .pipe(
        map(productData => {
          return {
            products: productData.products.map(product => {
              return {
                _id: product._id,
                name: product.name,
                brand: product.brand,
                price: product.price,
              };
            })
          };
        })
      )
      .subscribe(mappedProducts => {
        this.productsSearched = mappedProducts.products;
      });
    })
    this.productsSearched = this.productsService.getSearchedProducts();
    this.productsService.getSearchedProductsListener().subscribe(
      products => {
        this.productsSearched = products;
      }
    );
  }

}
