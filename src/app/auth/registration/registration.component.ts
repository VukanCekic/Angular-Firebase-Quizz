import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  authError: any;
  authSuccess: any;

  constructor(private  auth: AuthService) { }

  ngOnInit(): void {
    this.auth.eventAuthError$.subscribe(data => {
     this.authError = data;
    });
    this.auth.eventAuthSuccess$.subscribe(data => {
      this.authSuccess = data;
    });
  }

  // tslint:disable-next-line:typedef
  createUser(regForm: NgForm) {
    this.auth.createUser(regForm.value);
  }
}
