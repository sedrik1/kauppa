import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onCreateUser(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open('Tarkasta syöttämäsi tiedot', 'Sulje', {
        duration: 2000,
      });
      return;
    }
    const signupOutcome = this.authService.createUser(form.value.email, form.value.pwd, form.value.confirmPwd);
    if (!signupOutcome) {
      return;
    } else {
      form.resetForm();
    }
  }

}
