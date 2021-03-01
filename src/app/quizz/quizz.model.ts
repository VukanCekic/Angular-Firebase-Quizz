

export class QuizzModel {
  question: string;
  answer: number;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;

  constructor(question: string, answer: number, choice1: string, choice2: string, choice3: string, choice4: string ) {
   this.question = question;
   this.answer = answer;
   this.choice1 = choice1;
   this.choice2 = choice2;
   this.choice3 = choice3;
   this.choice4 = choice4;
  }

}


