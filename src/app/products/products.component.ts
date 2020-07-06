import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  callService(change: boolean) {
    this.authService.changeAuth(change);
  }

}
