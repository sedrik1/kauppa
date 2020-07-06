import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { ProductsService } from 'src/app/products/products.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  currentUser: string;
  currentUserAuthLevel: string;
  currentUserOrders: any[];
  constructor(
    private authService: AuthService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.productsService.getOrders(this.authService.getUserId());
    this.currentUser = this.authService.getUserEmail();
    this.currentUserAuthLevel = this.authService.getUserAuthLevel();
    this.currentUserOrders = this.productsService.getOrder();
    this.authService.getCurrentUserListener().subscribe( res => {
      this.currentUser = res;
    });
    this.productsService.getOrderListener().subscribe( res => {
      this.currentUserOrders = res;
    });
  }

  onChangeEmail(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.authService.changeUserEmail(form.value.newEmail, this.currentUser);
    form.resetForm();
  }

  onChangePwd(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.changePassword(this.currentUser, form.value.pwd);
    form.resetForm();
  }

  onCopyOrderId() {
    const id = document.getElementById('orderId').innerHTML;
    console.log(id.valueOf());
  }

}
