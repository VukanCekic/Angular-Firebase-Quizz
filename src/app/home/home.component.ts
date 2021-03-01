import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: firebase.User;
  document5: unknown;


  // @ts-ignore
  constructor(private auth: AuthService,
              private  router: Router) {
  }

    ngOnInit(): void {
    this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
      });
  }

  // tslint:disable-next-line:typedef
  login(){
    this.router.navigate(['login']);
  }
  // tslint:disable-next-line:typedef
  logout(){
     this.auth.logout();
  }

  // tslint:disable-next-line:typedef
  register(){
    this.router.navigate(['/register']);
  }

}
