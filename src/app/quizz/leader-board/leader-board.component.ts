import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {LeaderboardUserModel} from './leaderboardUser.model';
import firebase from 'firebase';
import {Subject} from 'rxjs';




@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  userList: LeaderboardUserModel;
  mapped: LeaderboardUserModel[];
  authError: any;
  authSuccess: any;
  user: firebase.User;

  adminField = new Subject<boolean>();
  adminField$  = this.adminField.asObservable();
  isNotAdmin;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
     this.auth.getUsers().snapshotChanges().subscribe( data => {
       this.mapped = data.map(actions => {
        const documentData = actions.payload.doc.data() as LeaderboardUserModel;
        const documentId = actions.payload.doc.id;
        return { documentId, ...documentData };
      });
       console.log(this.mapped);
    });

     this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
        this.notAdmin();
        this.adminField$.subscribe(data => {
          this.isNotAdmin = data;
        });
      });

     this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    });
     this.auth.eventAuthSuccess$.subscribe( data => {
      this.authSuccess = data;
    });
  }


  // tslint:disable-next-line:typedef
  notAdmin(){
    return this.auth.getDocument(this.user).subscribe(data => {
      if (data.get('admin') === 'NO'){
        this.adminField.next(true);
        console.log('NOT ADMIN');
      }else{
        this.adminField.next(false);
        console.log('ADMIN');
      }
    });
  }

  // tslint:disable-next-line:typedef
  wipeData(){
    this.auth.resetPoints();
    window.location.reload();
  }
}
