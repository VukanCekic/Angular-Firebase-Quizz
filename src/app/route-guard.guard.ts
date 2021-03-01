import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {AuthService} from './auth/auth.service';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardGuard implements CanActivate {
  user: firebase.User;
  constructor(private auth: AuthService, private router: Router) {
  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>  {
    await this.timeout(500);
    const user = firebase.auth().currentUser;
    if (user){
    return true;
    } else{
      this.router.navigate(['/login']);
      return false;
    }
  }

  // tslint:disable-next-line:typedef
    timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
