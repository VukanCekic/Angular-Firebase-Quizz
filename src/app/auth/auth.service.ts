

import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import firebase from 'firebase';
import {BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import User = firebase.User;
import {log} from 'util';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  newUser: any;
  private eventAuthError = new BehaviorSubject<string>('');
  private eventAuthSuccess = new BehaviorSubject<string>('');
  eventAuthError$ = this.eventAuthError.asObservable();
  eventAuthSuccess$ = this.eventAuthSuccess.asObservable();

  constructor(
    private  afAuth: AngularFireAuth,
    private dataBase: AngularFirestore,
    private router: Router,
    private httpClient: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
    createUser(user) {
    const pass = this.generateLocalPass();
    this.afAuth.createUserWithEmailAndPassword(user.email, user.password = pass)
      .then(userCredential => {
        this.newUser = user;
        const finalUser = {
          email: user.email,
          password: user.password
        };
        // NOT SHARED ON GITHUB - EMAIL SENDER APP
        // this.sendEmail('http://localhost:3000/sendmail', finalUser).subscribe(
          // data => {
           //  const res: any = data;
          //   console.log('yey');
         //  },
         // err => {
         // }
       // );
        //
        this.insertUserData(userCredential)
          .then( () => {
            const someData = 'copy your password: ' + user.password;
            this.eventAuthSuccess.next(someData);
          });
      })
      .catch(error => {
        this.eventAuthError.next(error);
      });
  }


  // tslint:disable-next-line:typedef
   getDocument(userCredential: firebase.User){
     return this.dataBase.doc(`Users/${userCredential.uid}`).get();
  }

  // tslint:disable-next-line:typedef
  getUsers(){
    return this.dataBase.collection('Users', ref => ref.orderBy('points'));
  }

  // tslint:disable-next-line:typedef
  resetPoints(){
    const docRef = this.dataBase.collection('Users').get();
    docRef.forEach(querySnapshot => {
      querySnapshot.forEach(doc => {
      doc.ref.update({
          points: 0,
        }).then(() => {
        const info = 'Points have been reset!';
        this.eventAuthSuccess.next(info);
      }).catch(error => {
        this.eventAuthError.next(error);
      });
      });
    });
  }

  // tslint:disable-next-line:typedef
  updateUser(userCredential: firebase.User, user){
      this.dataBase.doc(`Users/${userCredential.uid}`).update({
      displayName: user.displayName,
    }).then(() => {
      const info = 'Username has been updated';
      this.eventAuthSuccess.next(info);
    }).catch(error => {
      this.eventAuthError.next(error);
    });
  }

  // tslint:disable-next-line:typedef
  updateUserPoints(userCredential: firebase.User, finalPoints){
    this.dataBase.doc(`Users/${userCredential.uid}`).update({
      points: finalPoints,
    }).then(() => {
      const info = 'points have been updated';
      this.eventAuthSuccess.next(info);
    }).catch(error => {
      this.eventAuthError.next(error);
    });
  }

  // tslint:disable-next-line:typedef
  updateUserStreak(userCredential: firebase.User, obj){
    this.dataBase.doc(`Users/${userCredential.uid}`).update({
      lastName: obj.lastName,
      city: obj.city,
      address: obj.address,
    }).then(() => {
      const info = 'information has been updated';
      this.eventAuthSuccess.next(info);
    }).catch(error => {
      this.eventAuthError.next(error);
    });
  }





  // tslint:disable-next-line:typedef
  getUserState() {
    return this.afAuth.authState;

  }
  // tslint:disable-next-line:typedef
  login(email: string, password: string) {
    console.log(password);
    this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      }).then(userCredential => {
      if (userCredential) {
        this.router.navigate(['/home']);
      }
    });
  }

  // tslint:disable-next-line:typedef
  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.dataBase.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      lastName: '',
      displayName: '',
      city: '',
      address: '',
      points: 0,
      admin: 'NO',
    });
  }



  // tslint:disable-next-line:typedef
  logout() {
    return this.afAuth.signOut();
  }

  // tslint:disable-next-line:typedef
   generateLocalPass() {
    const chars = '0123456789abcdefghijklmnopqrstufvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*_+';
    const passwordLenth = 6;
    let password = '';

    for (let i = 0; i < passwordLenth; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }

  // tslint:disable-next-line:typedef
  sendEmail(url, data){
    return this.httpClient.post(url, data);

  }
}




