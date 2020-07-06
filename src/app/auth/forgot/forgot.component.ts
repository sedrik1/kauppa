import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onResetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    form.resetForm();
  }
}
