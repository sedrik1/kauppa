import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open('Tarkasta salasana ja sähköpostiosoite', 'Sulje', {
        duration: 2000,
      });
      return;
    }
    this.authService.loginUser(form.value.email, form.value.pwd);
  }
}
