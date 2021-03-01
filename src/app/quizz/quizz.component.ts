import {Component, ElementRef, OnChanges, OnInit, ViewChild} from '@angular/core';
import {QuizzModel} from './quizz.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import firebase from 'firebase';
import {NgForm} from '@angular/forms';
import {async, Subject} from 'rxjs';
import {Router} from '@angular/router';


@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})

export class QuizzComponent implements OnInit {

  // Quizz Variables
   currentQuestion: QuizzModel;
   acceptingAnswers = false;
   score = 0;
   questionCounter = 0;
   currentQuestionNumber;
   availableQuestions: QuizzModel[] = [];
   correctBonus = 10;
   maxQuestions = 10;
   gameStarted = false;
   selectedAnswer;
   bonusGiven = false;
   quizzBonusCounter = 0;
   @ViewChild('alert', { static: true }) alert: ElementRef;
   @ViewChild('myModal') myModal: ElementRef;
   @ViewChild('myModalAddressExisits') myModalAddressExisits: ElementRef;

   // Name Check Variables
   user: firebase.User;
   nameField = new Subject<boolean>();
   nameField$  = this.nameField.asObservable();
   pointsField = new Subject<boolean>();
   pointsField$  = this.pointsField.asObservable();
   addressField = new Subject<boolean>();
   addressField$  = this.addressField.asObservable();
   addressEmpty;
   points;
   userNameNotReady: boolean;
   authError: any;
   authSuccess: any;

   questions: [];




  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }



  // tslint:disable-next-line:typedef
   ngOnInit() {


     this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
        this.nameIsEmpty();
        this.pointsNumber();
        this.addressIsEmpty();
        this.pointsField$.subscribe(data => {
          this.points = data;
        });
        this.addressField$.subscribe(data => {
          this.addressEmpty = data;
        });
      });

     this.getQuizz().subscribe(quizz => {
       // PROBLEMATICAN DEO
       // const newData = JSON.stringify(quizz.results);
       // newData.replace(/&quot;/g, '');
       // console.log(newData);
       // PROBLEMATICAN DEO
       this.questions = quizz.results.map(loadedQUestion => {
        const formattedQuestion = {
          question: loadedQUestion.question,
          answer: loadedQUestion.answer,
        };
        const answerChoices = [...loadedQUestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        // console.log(loadedQUestion.correct_answer);
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQUestion.correct_answer);

        answerChoices.forEach((choice, index) => {
          formattedQuestion['choice' + (index + 1)] = choice;
        });
        // console.log(formattedQuestion);
        return formattedQuestion;

      });
    });

     this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    });
     this.auth.eventAuthSuccess$.subscribe( data => {
       this.authSuccess = data;
    });

     this.nameField$.subscribe(data => {
       this.userNameNotReady = data;
    });


  }

  // tslint:disable-next-line:typedef
  pointsNumber(){
    return this.auth.getDocument(this.user).subscribe(data => {
      this.pointsField.next(data.get('points'));
    });
  }




  // tslint:disable-next-line:typedef
   nameIsEmpty(){
    return this.auth.getDocument(this.user).subscribe(data => {
      if (data.get('displayName') === ''){
        this.nameField.next(true);
      }else{
        this.nameField.next(false);
      }
    });
  }


  // tslint:disable-next-line:typedef
  addressIsEmpty(){
    return this.auth.getDocument(this.user).subscribe(data => {
      if (data.get('address') === ''){
        this.addressField.next(true);
      }else{
        this.addressField.next(false);
      }
    });
  }

  // tslint:disable-next-line:typedef
  getQuizz() {
    const apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&type=multiple';
    const json = this.http.get<any>(apiUrl);
    return json;
  }

  // tslint:disable-next-line:typedef
  updateUser(regForm: NgForm) {
    console.log(regForm.value);
    this.auth.updateUser(this.user, regForm.value);
  }

  // tslint:disable-next-line:typedef
  updateUserStreak(regForm: NgForm) {
    console.log(regForm.value);
    this.auth.updateUserStreak(this.user, regForm.value);

  }

  refresh(): void {
    window.location.reload();
  }

  // tslint:disable-next-line:typedef
  startGame(){
    this.gameStarted = true;
    this.questionCounter = 0;
    this.score = 0;
    this.availableQuestions = [...this.questions];
    // console.log(this.availableQuestions);
    this.getNewQuestions();
}

  // tslint:disable-next-line:typedef
  getNewQuestions(){
    if (this.availableQuestions.length === 0 || this.questionCounter >= this.maxQuestions ){
      console.log(this.availableQuestions.length, this.questionCounter, this.maxQuestions);
      console.log(this.score + this.points);
      const finalPoints = this.points + this.score;
      this.auth.updateUserPoints(this.user, finalPoints);
      this.router.navigate(['/home']);
    }
    if (this.quizzBonusCounter === 3){
      this.quizzBonusCounter = 0;
      console.log(this.quizzBonusCounter);
      if (!this.bonusGiven){
          this.bonusGiven = true;
          if (this.addressEmpty === false){
               this.myModalAddressExisits.nativeElement.click();
          }else{
            this.myModal.nativeElement.click();
          }
      }
    }
    this.questionCounter++;
    this.currentQuestionNumber = this.questionCounter + '/' + this.maxQuestions;
    const questionIndex =  Math.floor(Math.random() * this.availableQuestions.length);
    this.currentQuestion = this.availableQuestions[questionIndex];


    this.availableQuestions.splice(questionIndex, 1);
    this.acceptingAnswers = true;

  }
  // tslint:disable-next-line:typedef
  checkAnswer(guess, answer, event){
    if (!this.acceptingAnswers) { return; }
    this.acceptingAnswers = false;
    const selectedChoice = event.target;
    let classToApply;
    if (guess === answer){
       this.quizzBonusCounter++;
       classToApply = 'bg-success';
       this.score += this.correctBonus;
     }else{
      this.quizzBonusCounter = 0;
      classToApply = 'bg-danger';
     }

    selectedChoice.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.classList.remove(classToApply);
      this.getNewQuestions();
    }, 1000);

  }

  // tslint:disable-next-line:typedef
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



}
