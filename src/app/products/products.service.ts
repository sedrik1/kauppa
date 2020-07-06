import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Product } from './product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsInCart = 0;
  productsInCartTotalPrice = 0;
  private orders = [];
  productsInCartArray = [];
  private searchedProducts = [];
  private products: Product[];
  private productsTops: Product[];
  private productsBottoms: Product[];
  private productsApparel: Product[];
  private productsListener = new Subject<Product[]>();
  private searchedProductsListener = new Subject<any[]>();
  private ordersListener = new Subject<any>();
  productsInCartArrayListener = new Subject<Product[]>();
  private productsTopsListener = new Subject<Product[]>();
  private productsBottomsListener = new Subject<Product[]>();
  private productsApparelListener = new Subject<Product[]>();
  productsInCartListener = new Subject<number>();
  productsInCartTotalPriceListener = new Subject<number>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getProductsInCart(): number {
    return this.productsInCart;
  }

  getProductsInCartTotal(): number {
    return this.productsInCartTotalPrice;
  }

  getProductsInCartArray() {
    return this.productsInCartArray;
  }

  getOrder(): any[] {
    return this.orders;
  }

  getSearchedProducts(): any[] {
    return this.searchedProducts;
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProductsTops(): Product[] {
    return this.productsTops;
  }

  getProductsBottoms(): Product[] {
    return this.productsBottoms;
  }

  getProductsApparel(): Product[] {
    return this.productsApparel;
  }

  getProductsInCartListener(): Observable<number>  {
    return this.productsInCartListener.asObservable();
  }

  getOrderListener(): Observable<any[]> {
    return this.ordersListener.asObservable();
  }

  getSearchedProductsListener(): Observable<any[]> {
    return this.searchedProductsListener.asObservable();
  }

  getProductsInCartTotalListener(): Observable<number> {
    return this.productsInCartTotalPriceListener.asObservable();
  }

  getProductsInCartArrayListener(): Observable<any> {
    return this.productsInCartArrayListener.asObservable();
  }

  getProductsListener(): Observable<Product[]> {
    return this.productsListener.asObservable();
  }

  getProductsTopsListener(): Observable<Product[]> {
    return this.productsTopsListener.asObservable();
  }

  getProductsApparelListener(): Observable<Product[]> {
    return this.productsApparelListener.asObservable();
  }

  getProductsBottomsListener(): Observable<Product[]> {
    return this.productsBottomsListener.asObservable();
  }

  getProductsDB(): void {
    this.http.get<{products: Product[], tops: Product[], bottoms: Product[], apparel: Product[]}>
    ('http://localhost:3000/api/products/getProducts')
    .pipe(
      map(productData => {
        return {
          products: productData.products.map(product => {
            return {
              _id: product._id,
              category: product.category,
              name: product.name,
              brand: product.brand,
              quantity: product.quantity,
              price: product.price,
              sizes: product.sizes,
              colours: product.colours
            };
          }),
          tops: productData.tops.map(product => {
            return {
              _id: product._id,
              category: product.category,
              name: product.name,
              brand: product.brand,
              quantity: product.quantity,
              price: product.price,
              sizes: product.sizes,
              colours: product.colours
            };
          }),
          bottoms: productData.bottoms.map(product => {
            return {
              _id: product._id,
              category: product.category,
              name: product.name,
              brand: product.brand,
              quantity: product.quantity,
              price: product.price,
              sizes: product.sizes,
              colours: product.colours
            };
          }),
          apparel: productData.apparel.map(product => {
            return {
              _id: product._id,
              category: product.category,
              name: product.name,
              brand: product.brand,
              quantity: product.quantity,
              price: product.price,
              sizes: product.sizes,
              colours: product.colours
            };
          })
        };
      })
    )
    .subscribe(
      mappedProducts => {
        this.products = mappedProducts.products;
        this.productsTops = mappedProducts.tops;
        this.productsBottoms = mappedProducts.bottoms;
        this.productsApparel = mappedProducts.apparel;
        this.productsListener.next([...this.products]);
        this.productsTopsListener.next([...this.productsTops]);
        this.productsBottomsListener.next([...this.productsBottoms]);
        this.productsApparelListener.next([...this.productsApparel]);
      }
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>
    (`http://localhost:3000/api/products/getProduct/${id}`);
  }

  searchForProducts(query: string) {
    return this.http.get<{products?: Product[], message?: string}>(
      `http://localhost:3000/api/products/getProducts/${query}`
    );
  }

  placeAnOrder(orderProducts: any[], customerId): void {
    this.http.post<{message: string}>(
    'http://localhost:3000/api/orders/placeAnOrder',
    { orderProducts, customerId })
    .subscribe(message => {
      if (message.message === 'Tilaus käsitelty') {
        localStorage.removeItem('cart');
        localStorage.setItem('orderDone', 'done');
        localStorage.setItem('orderProducts', JSON.stringify(orderProducts));
        console.log(message.message);
        this.getProductsDB();
        this.productsInCart = 0;
        this.productsInCartArray = [];
        this.productsInCartTotalPrice = 0;
        this.productsInCartListener.next(this.productsInCart.valueOf());
        this.productsInCartArrayListener.next([...this.productsInCartArray]);
        this.productsInCartTotalPriceListener.next(this.productsInCartTotalPrice.valueOf());
        this.router.navigate(['/completed']);
      } else {
        console.log(message.message);
      }
    });
  }

  getOrders(id: string): void {
    this.http.post<{orders: any[]}>('http://localhost:3000/api/orders/getOrders', { customerId: id })
    .subscribe(
      orders => {
        this.orders = orders.orders;
        this.ordersListener.next([...this.orders]);
      }
    );
  }

  addProductToCart(product): void {
    let cartLength = 0;
    const presentProduct = this.findPresentProductIndex(product);
    if (presentProduct === undefined) {
      this.productsInCartArray.push(product);
      this.productsInCartArrayListener.next([...this.productsInCartArray]);
      this.productsInCartTotalPrice += product.price;
      this.productsInCartTotalPriceListener.next(this.productsInCartTotalPrice);
      for (const element of this.productsInCartArray) {
        cartLength += element.quantity;
      }
      this.productsInCart = cartLength;
      this.productsInCartListener.next(this.productsInCart);
    } else {
      presentProduct.quantity++;
      this.productsInCartArrayListener.next([...this.productsInCartArray]);
      this.productsInCartTotalPrice += product.price;
      this.productsInCartTotalPriceListener.next(this.productsInCartTotalPrice);
      for (const element of this.productsInCartArray) {
        cartLength += element.quantity;
      }
      this.productsInCart = cartLength;
      this.productsInCartListener.next(this.productsInCart);
    }
    cartLength = 0;
  }

  deleteItemFromCart(product): void {
    const deleteIndex = this.findDeleteIndex(product);
    this.productsInCartTotalPrice = this.productsInCartTotalPrice - product.price * product.quantity;
    this.productsInCartTotalPriceListener.next(this.productsInCartTotalPrice);
    this.productsInCartArray.splice(deleteIndex, 1);
    this.productsInCartArrayListener.next([...this.productsInCartArray]);
    this.productsInCart = this.productsInCart - product.quantity;
    if (this.productsInCart < 0) {
      this.productsInCart = 0;
      this.productsInCartListener.next(this.productsInCart);
    } else {
      this.productsInCartListener.next(this.productsInCart);
    }
  }

  changeItemQuantityInCart(quantity: number, product: Product): void {
    let cartLength = 0;
    const presentProduct = this.findPresentProductIndex(product);
    if (presentProduct.quantity < quantity) {
      presentProduct.quantity++;
      this.productsInCartTotalPrice += product.price;
      this.productsInCartTotalPriceListener.next(this.productsInCartTotalPrice);
    } else {
      presentProduct.quantity--;
      this.productsInCartTotalPrice -= product.price;
      this.productsInCartTotalPriceListener.next(this.productsInCartTotalPrice);
    }
    this.productsInCartArrayListener.next([...this.productsInCartArray]);
    for (const element of this.productsInCartArray) {
      cartLength += element.quantity;
    }
    this.productsInCart = cartLength;
    this.productsInCartListener.next(this.productsInCart);
    cartLength = 0;
  }

  private findPresentProductIndex(product): any {
    return this.productsInCartArray.find(
      obj => obj._id === product._id
      && obj.colours[0] === product.colours[0]
      && obj.sizes[0] === product.sizes[0]
    );
  }

  private findDeleteIndex(product): number {
    return this.productsInCartArray.findIndex(
      obj => obj._id === product._id
      && obj.colours[0] === product.colours[0]
      && obj.sizes[0] === product.sizes[0]
    );
  }

}
