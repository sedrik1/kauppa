import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-completed-order',
  templateUrl: './completed-order.component.html',
  styleUrls: ['./completed-order.component.css']
})
export class CompletedOrderComponent implements OnInit {
  orderedProducts: any[];
  totalPrice = 0;

  constructor(private route: Router) { }

  ngOnInit(): void {
    if (!localStorage.hasOwnProperty('orderDone')) {
      this.route.navigate(['/']);
    } else {
      this.orderedProducts = JSON.parse(localStorage.getItem('orderProducts'));
      console.log(this.orderedProducts);
      for (const ordProd of this.orderedProducts) {
        this.totalPrice += ordProd.price * ordProd.quantity;
      }
    }
    const orderInspectionExpiration = new Date();
    orderInspectionExpiration.setMinutes( orderInspectionExpiration.getMinutes() + 5);
    localStorage.setItem('timer', JSON.stringify(orderInspectionExpiration));
  }

}
